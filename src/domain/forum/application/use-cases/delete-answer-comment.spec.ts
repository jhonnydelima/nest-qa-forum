import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const answerComment = makeAnswerComment()
    await answerCommentsRepository.create(answerComment)
    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })
    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete another user's answer comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueIdEntity('author-1'),
    })
    await answerCommentsRepository.create(answerComment)
    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
