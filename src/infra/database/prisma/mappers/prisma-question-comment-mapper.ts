import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.answerId) {
      throw new Error('invalid comment type.')
    }
    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createAt,
        updatedAt: raw.updateAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      questionId: questionComment.questionId.toString(),
      authorId: questionComment.authorId.toString(),
      content: questionComment.content,
      createAt: questionComment.createdAt,
      updateAt: questionComment.updatedAt,
    }
  }
}
