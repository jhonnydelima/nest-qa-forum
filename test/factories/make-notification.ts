import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  overrides: Partial<NotificationProps> = {},
  id?: string,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueIdEntity(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...overrides,
    },
    id,
  )
  return notification
}
