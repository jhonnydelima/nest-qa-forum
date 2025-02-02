import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer()
    await answersRepository.create(newAnswer)
    expect(answersRepository.items).toHaveLength(1)
    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueIdEntity('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueIdEntity('2'),
      }),
    )
    expect(answerAttachmentsRepository.items).toHaveLength(2)
    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })
    expect(answersRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const newAnswer = makeAnswer()
    await answersRepository.create(newAnswer)
    expect(answersRepository.items).toHaveLength(1)
    const result = await sut.execute({
      authorId: 'another-author-id',
      answerId: newAnswer.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete an answer that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      answerId: 'answer-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
