import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'

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

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)
    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })
    return answerComment
  }
}
