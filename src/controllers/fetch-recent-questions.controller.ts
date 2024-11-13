import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
// uso para acionar meu jwt.strategy.ts e proteger a rota
// usamos 'jwt' porque estmaos usando jwt strategy do passport
// @UseGuards(AuthGuard('jwt')) --> forma antiga
// atualizei para usar uma classe JwtAuthGuard que instancia um AuthGuard('jwt')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prismaDependency: PrismaService) {}

  @Get()
  async handle() {}
}
