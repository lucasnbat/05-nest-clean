import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string // garantir que apenas autor do comenta´rio possa deletar
  answerCommentId: string
}

// tipa que a resposta vai ser ou um erro (left) que pode ser
// ou uma instancia de ResourceNotFoundError ou NotAllowedError
// em caso de sucesso retorna objeto vazio como aponta o return right({})
type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    // encontra o comentário da resposta
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    // verifica se é o autor do comentário
    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    // se for o autor do comentário, permite deletar
    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
