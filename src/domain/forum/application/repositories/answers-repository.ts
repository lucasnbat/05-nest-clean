import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
  // recebe o objeto answer para gravar no banco
  abstract create(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>

  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
