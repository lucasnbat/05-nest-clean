import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

// lembre que essa classe representa o evento registrado, mas não
// disparado.
export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
