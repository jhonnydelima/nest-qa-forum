import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnBestAnswerChosen } from '@/domain/notification/application/subscribers/on-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnAnswerCreated, OnBestAnswerChosen, SendNotificationUseCase],
})
export class EventsModule {}
