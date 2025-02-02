import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()
    await questionCommentsRepository.create(questionComment)
    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })
    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete another user's question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueIdEntity('author-1'),
    })
    await questionCommentsRepository.create(questionComment)
    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
