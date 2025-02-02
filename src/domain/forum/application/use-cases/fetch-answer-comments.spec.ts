import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch comments by an answer', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueIdEntity('answer-1'),
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueIdEntity('answer-1'),
      }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueIdEntity('answer-1'),
      }),
    )
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated comments by an answer', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueIdEntity('answer-1'),
        }),
      )
    }
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
