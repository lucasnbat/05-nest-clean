import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number) // isso nao valida, ele transforma para number
  .pipe(z.number().min(1)) // o pipe valida considerando todas as outras validações anteriores como um resultado só

type PageQueryParamType = z.infer<typeof pageQueryParamsSchema>

// preparando o pipe
const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('/questions')
// uso para acionar meu jwt.strategy.ts e proteger a rota
// usamos 'jwt' porque estmaos usando jwt strategy do passport
// @UseGuards(AuthGuard('jwt')) --> forma antiga
// atualizei para usar uma classe JwtAuthGuard que instancia um AuthGuard('jwt')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prismaDependency: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamType) {
    /* 
     * Se tá na página 1, não pula nada e mostra apenas a pergunta mais recente 
    (lembre: é uma por página). 
     * Se tá na página 2, pula uma (a primeira mais recente) e mostra a segunda,
    que é a segunda pergunta mais recente 
     */
    const perPage = 20
    const questions = await this.prismaDependency.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createAt: 'desc', // ordena das mais recentes para mais antigas
      },
    })

    return { questions }
  }
}
