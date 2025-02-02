import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch answers by a question', async () => {
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated answers by a question', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({
          questionId: new UniqueIdEntity('question-1'),
        }),
      )
    }
    const result = await sut.execute({ questionId: 'question-1', page: 2 })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
