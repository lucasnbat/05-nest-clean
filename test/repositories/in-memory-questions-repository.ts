import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

// IMPORTANTE:
// Você PRECISA entender que aqui, o repositorio de anexos é separado
// e tem os anexos existindo de forma pura e sem ligação até que você
// ASSOCIE eles com uma pergunta ou resposta.

// O repositório de questions aqui, ao criar uma pergunta, chama o repo
// de anexos e cria os anexos primeiro lá na sua forma pura; ao deletar
// anexos da pergunta, o repo de questions também chama o repo de anexos
// e deleta os anexos de la.

// É como se fossem duas prateleiras. Uma de questions e outra de anexos.
// A prateleira de anexos pode ter anexos tanto de perguntas como de res-
// postas...o que faz um anexo pertencer a uma pergunta ou resposta é o
// id da pergunta ou resposta estar presente nele.
// Se tem id de pergunta e null no campo id de resposta, é anexo de pergunta.

// Repositório fake de Questions que busca simular o que uma maquinaria
// como o prisma, typeOrm, sequelize fariam, mas numa versão apenas em
// memória (usando vetores)
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  // veja que mesmo dentro da maquinaria in-memory eu tambem posso usar
  // um construtor e ainda aplicar inversão de dependência aqui
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    // precisaremos da url do anexo... na implementação real do controller o
    // caso de uso de uploadAttachment usa o attachment (objeto entidade)para
    // criar e devolver uma instancia de attachment que tem a url disponível
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID ${question.authorId.toString()} does not exist`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        // retorna lista de anexos da pergunta
        return questionAttachment.questionId.equals(question.id)
      },
    )

    // pega a lista de attachments retornada antes e busca no repositorio de
    // attachments o anexo puro relativo Aquela pergunta
    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} does not exist`,
        )
      }

      return attachment // isso é o anexo de uma iteração, vai sair um array de anexos do map()
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments, // peguei os attachments retornados acima pelo map()
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  // essa função simula um prisma.question.create({}) por ex
  async create(question: Question) {
    this.items.push(question)

    // cria os anexos dentro do repo de anexos
    await this.questionAttachmentsRepository.createMany(
      // pega os anexos da question recebida e envia para a função
      // createMany()
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string) {
    // converte o UniqueEntityID interno em string para comparar com a string recebida
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  // save recebe um objeto com novos dados...
  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    // e substitui pelos dados recebidos
    this.items[itemIndex] = question

    // cria os anexos e salva no repo de anexos apenas os novos anexos criados
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    // deleta os anexos removidos, ou seja, vai tirar eles do repo de anexos
    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  // retorna questions ordenadas com base no createdAt (mais recentes primeiro)
  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20) // page = 1 ? -> corta da posição 0 a 20

    return questions
  }
}
