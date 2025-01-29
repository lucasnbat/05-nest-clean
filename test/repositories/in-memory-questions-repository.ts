import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

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
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
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
