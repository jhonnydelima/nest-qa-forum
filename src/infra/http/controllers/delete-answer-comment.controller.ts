import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub
    const result = await this.deleteAnswerCommentUseCase.execute({
      authorId: userId,
      answerCommentId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
