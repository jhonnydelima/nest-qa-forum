import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const authenticateBodyScheme = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodyScheme>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudentUseCase: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodyScheme))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body
    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    })
    if (result.isLeft()) {
      throw new Error()
    }
    return {
      access_token: result.value.accessToken,
    }
  }
}
