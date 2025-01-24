import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      content: 'Example content',
      answerId: new UniqueEntityID(),
      ...override, // sobrescreve com a chave/valor que foi recebida no makeAnswer()
    },
    id, // retorna o id manual (se foi passado)
  )

  return answerComment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })

    return answerComment
  }
}
