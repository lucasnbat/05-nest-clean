import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayloadType } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204) // resposta 204 de executado mas que não retorna nada
  async handle(
    @CurrentUser() user: UserPayloadType,
    @Param('id') questionId: string, // captura parâmetro e renomeia para questionId
  ) {
    const userId = user.sub

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
