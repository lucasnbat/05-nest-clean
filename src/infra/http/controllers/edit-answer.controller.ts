import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayloadType } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

const editAnswerBodySchema = z.object({
  content: z.string(),
})

type EditAnswerBodyType = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

// aqui para editar resposta não é relevante saber o id da questão, então
// não precisa colocar questionId aqui
@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204) // resposta 204 de executado mas que não retorna nada
  async handle(
    @CurrentUser() user: UserPayloadType,
    @Body(bodyValidationPipe) body: EditAnswerBodyType,
    @Param('id') answerId: string, // captura parâmetro e renomeia para questionId
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      content,
      answerId,
      authorId: userId,
      attachmentsIds: [],
    })

    // não é necessário tratar vários erros aqui porque um erro de
    // recurso não encontrado dentro do caso de uso de editar resposta
    // é muito improvavel de acontecer.
    // logo, a tratativa existe sim no caso de uso, mas aqui no controller
    // você pode esqueccer isso e lidar apenas com os erros mais provaveis
    // do usuário quando ele interage com o front-end
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
