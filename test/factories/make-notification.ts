import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })
    return notification
  }
}
