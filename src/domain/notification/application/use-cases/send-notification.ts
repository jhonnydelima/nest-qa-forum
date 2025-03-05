import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Injectable } from '@nestjs/common'

export type SendNotificationUseCaseRequest = {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueIdEntity(recipientId),
      title,
      content,
    })
    await this.notificationsRepository.create(notification)
    return right({
      notification,
    })
  }
}
