import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../entities/answer'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.ocurredAt = new Date()
    this.answer = answer
  }

  getAggregateId(): UniqueIdEntity {
    return this.answer.id
  }
}
