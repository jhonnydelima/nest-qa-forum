import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)
    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    })
    return answerAttachment
  }
}
