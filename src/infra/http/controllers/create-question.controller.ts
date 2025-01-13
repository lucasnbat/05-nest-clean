import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayloadType } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

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
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaDependency: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayloadType,
    @Body(bodyValidationPipe) body: CreateQuestionBodyType,
  ) {
    const { content, title } = body
    const userId = user.sub

    const slug = this.convertToSlug(title)

    await this.prismaDependency.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
    // aparentemente é possível buscar o user porque é uma rota autenticada
    // então o sistema de módulos extrai o user a partir do token
    // console.log(user.sub)
    return 'ok'
  }

  // função para conversão para slug
  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
