import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'

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
      const error = result.value

      // pega a classe retornada pelo isLeft() do caso de uso
      switch (error.constructor) {
        // se for classe de aluno já existente..
        case StudentAlreadyExistsError:
          // dispara um erro que é status code 409 pro nestjs
          throw new ConflictException(error.message)
        default:
          // se não dispara esse BadRequestException que é status code 400
          throw new BadRequestException(error.message)
      }
    }
  }
}
