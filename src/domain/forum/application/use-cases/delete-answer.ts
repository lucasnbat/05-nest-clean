import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

// aqui precisa abrigar apenas a lógica que usa a maquinaria para fazer o que
// a regra de negócio pede...para reproduzir o cenário do zero usamos testes
@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answerFinded = await this.answersRepository.findById(answerId)

    if (!answerFinded) {
      return left(new ResourceNotFoundError())
    }

    // se o autor da deleção não for o author da pergunnta, bloqueia
    if (authorId !== answerFinded.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.answersRepository.delete(answerFinded)

    return right(null)
  }
}
