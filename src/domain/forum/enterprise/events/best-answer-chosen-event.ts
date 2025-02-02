import { DomainEvent } from '@/core/events/domain-event'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Question } from '../entities/question'

export class BestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueIdEntity

  constructor(question: Question, bestAnswerId: UniqueIdEntity) {
    this.ocurredAt = new Date()
    this.question = question
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueIdEntity {
    return this.question.id
  }
}
