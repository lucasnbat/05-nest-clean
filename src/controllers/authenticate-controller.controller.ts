import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

// const createAccountBodySchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string(),
// })

// type CreateAccountBodyType = z.infer<typeof createAccountBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  // jwt(Diego) -> jwtDependency(eu)
  // abaixo, tipagem vinda do @nestjs/jwt
  constructor(private jwtDependency: JwtService) {}

  @Post()
  async handle() {
    const token = this.jwtDependency.sign({ sub: 'user-id' })

    return token
  }
}
