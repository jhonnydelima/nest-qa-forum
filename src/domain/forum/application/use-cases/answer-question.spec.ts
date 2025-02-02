import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'New answer',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.getItems()).toHaveLength(2)
    expect(answersRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueIdEntity('1') }),
      expect.objectContaining({ attachmentId: new UniqueIdEntity('2') }),
    ])
  })
})
