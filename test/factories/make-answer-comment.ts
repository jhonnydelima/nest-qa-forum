import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  overrides: Partial<AnswerCommentProps> = {},
  id?: string,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueIdEntity(),
      answerId: new UniqueIdEntity(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
  return answerComment
}
