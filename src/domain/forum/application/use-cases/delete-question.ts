import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

// aqui precisa abrigar apenas a lógica que usa a maquinaria para fazer o que
// a regra de negócio pede...para reproduzir o cenário do zero usamos testes
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const questionFinded = await this.questionsRepository.findById(questionId)

    if (!questionFinded) {
      return left(new ResourceNotFoundError())
    }

    // se o autor da deleção não for o author da pergunnta, bloqueia
    if (authorId !== questionFinded.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.questionsRepository.delete(questionFinded)

    return right({})
  }
}
