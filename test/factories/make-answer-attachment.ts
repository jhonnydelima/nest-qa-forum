import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  overrides: Partial<AnswerAttachmentProps> = {},
  id?: string,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueIdEntity(),
      attachmentId: new UniqueIdEntity(),
      ...overrides,
    },
    id,
  )
  return answerAttachment
}
