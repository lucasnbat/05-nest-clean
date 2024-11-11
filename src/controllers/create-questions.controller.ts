import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

// minute: 01:56
@Controller('/questions')
// uso para acionar meu jwt.strategy.ts e proteger a rota
// usamos 'jwt' porque estmaos usando jwt strategy do passport
// @UseGuards(AuthGuard('jwt')) --> forma antiga
// atualizei para usar uma classe JwtAuthGuard que instancia um AuthGuard('jwt')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  async handle() {
    return 'ok'
  }
}
