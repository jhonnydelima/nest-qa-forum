import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  overrides: Partial<QuestionAttachmentProps> = {},
  id?: string,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueIdEntity(),
      attachmentId: new UniqueIdEntity(),
      ...overrides,
    },
    id,
  )
  return questionAttachment
}
