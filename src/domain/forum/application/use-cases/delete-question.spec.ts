import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)
    expect(questionsRepository.items).toHaveLength(1)
    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueIdEntity('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueIdEntity('2'),
      }),
    )
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
    })
    expect(questionsRepository.items).toHaveLength(0)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)
    expect(questionsRepository.items).toHaveLength(1)
    const result = await sut.execute({
      authorId: 'another-user-id',
      questionId: newQuestion.id.toString(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete a question that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'user-id',
      questionId: 'question-id',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
