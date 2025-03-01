import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch comments by an answer', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })
    await studentsRepository.create(student)
    const comment1 = makeAnswerComment({
      answerId: new UniqueIdEntity('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueIdEntity('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueIdEntity('answer-1'),
      authorId: student.id,
    })
    await answerCommentsRepository.create(comment1)
    await answerCommentsRepository.create(comment2)
    await answerCommentsRepository.create(comment3)
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated comments by an answer', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })
    await studentsRepository.create(student)
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueIdEntity('answer-1'),
          authorId: student.id,
        }),
      )
    }
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
