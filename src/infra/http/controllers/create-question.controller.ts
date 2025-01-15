import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayloadType } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodyType = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
// uso para acionar meu jwt.strategy.ts e proteger a rota
// usamos 'jwt' porque estmaos usando jwt strategy do passport
// @UseGuards(AuthGuard('jwt')) --> forma antiga
// atualizei para usar uma classe JwtAuthGuard que instancia um AuthGuard('jwt')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayloadType,
    @Body(bodyValidationPipe) body: CreateQuestionBodyType,
  ) {
    const { content, title } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    // aparentemente é possível buscar o user porque é uma rota autenticada
    // então o sistema de módulos extrai o user a partir do token
    // console.log(user.sub)

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
