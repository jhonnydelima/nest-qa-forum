import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { BestAnswerChosenEvent } from '@/domain/forum/enterprise/events/best-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

export class OnBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerNotification.bind(this),
      BestAnswerChosenEvent.name,
    )
  }

  private async sendBestAnswerNotification({
    question,
    bestAnswerId,
  }: BestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )
    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
      })
    }
  }
}
