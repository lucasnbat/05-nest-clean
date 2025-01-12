import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      content: 'Example content',
      questionId: new UniqueEntityID(),
      ...override, // sobrescreve com a chave/valor que foi recebida no makeQuestion()
    },
    id, // retorna o id manual (se foi passado)
  )

  return questionComment
}
