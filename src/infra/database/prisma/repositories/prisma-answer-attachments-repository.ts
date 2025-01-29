import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'

// pois vai ser enviado como dependency para algum construtor de outra classe
// Importante você entender que  função save() exige o uso de métodos deleteMany()
// e createMany(), pois um ou muitos anexos podem ser criados ou eliminados ao
// editar algo
@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answerAttachments.map((answerAttachment) =>
      PrismaAnswerAttachmentMapper.toDomain(answerAttachment),
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    })
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    // associando anexos por meio da autalização do campo questionId para
    // apontar para a questão
    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)
    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }
    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })
    await this.prisma.attachment.deleteMany({
      where: {
        // deleta todos os registros cujo id esteja na lista de ids passada
        // para a função
        id: {
          in: attachmentIds,
        },
      },
    })
  }
}
