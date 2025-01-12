import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

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
