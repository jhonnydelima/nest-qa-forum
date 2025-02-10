import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'

export function makeAnswer(overrides: Partial<AnswerProps> = {}, id?: string) {
  const answer = Answer.create(
    {
      authorId: new UniqueIdEntity(),
      questionId: new UniqueIdEntity(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })
    return answer
  }
}
