import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayloadType } from 'src/auth/jwt.strategy'

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
  async handle(@CurrentUser() user: UserPayloadType) {
    // aparentemente é possível buscar o user porque é uma rota autenticada
    // então o sistema de módulos extrai o user a partir do token
    console.log(user.sub)
    return 'ok'
  }
}
