import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit a answer', async () => {
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
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'New Content',
      attachmentsIds: ['1', '3'],
    })
    expect(answersRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
    expect(answersRepository.items[0].attachments.getItems()).toHaveLength(2)
    expect(answersRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueIdEntity('1') }),
      expect.objectContaining({ attachmentId: new UniqueIdEntity('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer()
    await answersRepository.create(newAnswer)
    expect(answersRepository.items).toHaveLength(1)
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'another-author-id',
      content: 'New Content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a answer that does not exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'New Content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
