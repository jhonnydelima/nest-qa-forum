import { ChooseBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/answers/:answerId/choose-best')
export class ChooseBestAnswerController {
  constructor(
    private readonly chooseBestAnswerUseCase: ChooseBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const userId = user.sub
    const result = await this.chooseBestAnswerUseCase.execute({
      answerId,
      authorId: userId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
