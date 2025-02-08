import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }
    return AnswerAttachment.create(
      {
        attachmentId: new UniqueIdEntity(raw.id),
        answerId: new UniqueIdEntity(raw.answerId),
      },
      raw.id,
    )
  }
}
