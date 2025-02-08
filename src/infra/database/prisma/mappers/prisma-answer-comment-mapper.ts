import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }
    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueIdEntity(raw.authorId),
        answerId: new UniqueIdEntity(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
