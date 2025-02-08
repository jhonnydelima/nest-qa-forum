import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }
    return QuestionAttachment.create(
      {
        attachmentId: new UniqueIdEntity(raw.id),
        questionId: new UniqueIdEntity(raw.questionId),
      },
      raw.id,
    )
  }
}
