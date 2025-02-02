import { UniqueIdEntity } from '../entities/unique-id-entity'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueIdEntity
}
