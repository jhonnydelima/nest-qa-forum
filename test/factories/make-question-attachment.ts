import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)
    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })
    return questionAttachment
  }
}