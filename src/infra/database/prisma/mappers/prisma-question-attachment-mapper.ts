import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaComment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('invalid attachment type.')
    }
    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        // associa o mesmo id de question... (pois no caso todos os anexos
        // vao ser da questão que está sendo processada no metodo do repo)
        questionId: attachments[0].questionId.toString(),
      },
    }
  }
}

// não precisa de toPrisma() porque não tem necessidade de converter
// entidades da camada de dominio para camada de persistência...maioria
// dos casos de uso com attachment são operações de leitura
