import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodyType = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201) // força código de sucesso da rota ser 201
  @UsePipes(new ZodValidationPipe(createAccountBodySchema)) // aciona o pipe para interceptar e validar o body
  // veja que para pegar o body você precisa usar o decorator @Body e salvar
  // na variável body logo em seguida. tipagem é any por enquanto
  async handle(@Body() body: CreateAccountBodyType) {
    // valida e extrai informações por destructuring
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}
