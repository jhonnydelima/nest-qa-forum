import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseBestAnswerUseCase

describe('Choose Best Answer Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new ChooseBestAnswerUseCase(questionsRepository, answersRepository)
  })

  it('should be able to choose the best answer', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)
    const answer = makeAnswer({
      questionId: question.id,
    })
    await answersRepository.create(answer)
    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose the best answer if the answer does not exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to choose the best answer if the question does not exist', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to choose the best answer from another user's question", async () => {
    const question = makeQuestion({
      authorId: new UniqueIdEntity('author-1'),
    })
    await questionsRepository.create(question)
    const answer = makeAnswer({
      questionId: question.id,
    })
    await answersRepository.create(answer)
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
