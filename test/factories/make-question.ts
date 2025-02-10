import { faker } from '@faker-js/faker'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export function makeQuestion(
  overrides: Partial<QuestionProps> = {},
  id?: string,
) {
  const question = Question.create(
    {
      authorId: new UniqueIdEntity(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...overrides,
    },
    id,
  )
  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })
    return question
  }
}
