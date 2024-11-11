import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  // jwt(Diego) -> jwtDependency(eu)
  // abaixo, tipagem vinda do @nestjs/jwt
  constructor(
    private jwtDependency: JwtService,
    private prismaDependecy: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodyType) {
    const { email, password } = body

    const user = await this.prismaDependecy.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException("User credentials doesn't match")
    }

    // compara senha enviada com a senha real cifrada do user no banco
    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException("User credentials doesn't match")
    }

    const accessToken = this.jwtDependency.sign({ sub: user.id })

    return {
      access_token: accessToken, // retorno ao front em underscore case (snake)
    }
  }
}
