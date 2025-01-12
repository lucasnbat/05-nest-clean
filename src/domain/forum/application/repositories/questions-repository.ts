import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>
  create(question: Question): Promise<void>
  // feito inicialmente para achar pergunta antes de deletar
  findById(id: string): Promise<Question | null>
  // usada para retornar várias perguntas recentes
  findManyRecent(params: PaginationParams): Promise<Question[]>
  // save: para salvar question dentro de caso de uso de edição
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
