import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

// Injectable aqui NÃO É O IDEAL. Você deveria seguir o que está escrito
// no arquivo nest-create-question-use-case
@Injectable()
export class CreateQuestionUseCase {
  // no lugar de QuestionsRepository é injetado o PrismaQuestionsRepository
  // por causa das regras de database.module.ts... ele quem trabalha com o banco
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      // na requisição vai vir como string, mas a classe processa como
      // UniqueEntityID, o que faz necessário converter a string para isso
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    // aqui estou usando o set attachments da classe para inserir os anexos
    question.attachments = new QuestionAttachmentList(questionAttachments)

    // passa para a parte de infra que vai salvar (prisma, TypeOrm...)
    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
