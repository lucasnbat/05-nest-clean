import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

// export interface QuestionsRepository {
//   findBySlug(slug: string): Promise<Question | null>
//   create(question: Question): Promise<void>
//   // feito inicialmente para achar pergunta antes de deletar
//   findById(id: string): Promise<Question | null>
//   // usada para retornar várias perguntas recentes
//   findManyRecent(params: PaginationParams): Promise<Question[]>
//   // save: para salvar question dentro de caso de uso de edição
//   save(question: Question): Promise<void>
//   delete(question: Question): Promise<void>
// }

// acima a versão antiga...abaixo a versão abstract que o nestjs exige
// para poder funcionar

export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract create(question: Question): Promise<void>
  abstract findById(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
