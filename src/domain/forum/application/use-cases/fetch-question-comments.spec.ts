import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch comments by a question', async () => {
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueIdEntity('question-1'),
      }),
    )
    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated comments by a question', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueIdEntity('question-1'),
        }),
      )
    }
    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
