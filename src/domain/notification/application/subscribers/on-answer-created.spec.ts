import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { OnAnswerCreated } from './on-answer-created'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { MockInstance } from 'vitest'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })
    await questionsRepository.create(question)
    await answersRepository.create(answer)
    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
