import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'

// pois vai ser enviado como dependency para algum construtor de outra classe
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }

  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }

  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }

  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
