import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-slug'),
    })
    await questionsRepository.create(newQuestion)
    const result = await sut.execute({ slug: 'example-slug' })
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        id: newQuestion.id,
        title: newQuestion.title,
      }),
    })
  })
})
