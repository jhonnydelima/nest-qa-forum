import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
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
    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: ['1', '3'],
    })
    expect(questionsRepository.items[0]).toMatchObject({
      title: 'New Title',
      content: 'New Content',
    })
    expect(questionsRepository.items[0].attachments.getItems()).toHaveLength(2)
    expect(questionsRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueIdEntity('1') }),
      expect.objectContaining({ attachmentId: new UniqueIdEntity('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)
    expect(questionsRepository.items).toHaveLength(1)
    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'another-author-id',
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a question that does not exist', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      authorId: 'author-id',
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
