import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  overrides: Partial<QuestionCommentProps> = {},
  id?: string,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueIdEntity(),
      questionId: new UniqueIdEntity(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
  return questionComment
}
