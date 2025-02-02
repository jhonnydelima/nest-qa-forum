import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(overrides: Partial<AnswerProps> = {}, id?: string) {
  const answer = Answer.create(
    {
      authorId: new UniqueIdEntity(),
      questionId: new UniqueIdEntity(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
  return answer
}
