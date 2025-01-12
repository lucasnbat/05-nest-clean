import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(
    // isso abaixo que vai efetivamente gravar a resposta no banco com uma
    // lógica de negócio própria dentro dele, é uma maquinaria tipo um prisma,
    // um TypeORM, um Sequelize...
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    }) // vai gerar uma nova answer

    // instancia vários answerAttachments a partir dos ids de attachment
    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentsId),
        answerId: answer.id,
      })
    })

    // cria a lista com as instancias de answerAttachment e seta essa
    // lista no atributo attachments da instancia da classe
    answer.attachments = new AnswerAttachmentList(answerAttachments)

    // mesmo que não tenha o create() implementado ainda passo a answer e ele a-
    // ceita porque a  assinatura dele em repositories/answers-repository permite
    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
