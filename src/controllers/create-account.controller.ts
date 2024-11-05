import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201) // força código de sucesso da rota ser 201

  // veja que para pegar o body você precisa usar o decorator @Body e salvar
  // na variável body logo em seguida. tipagem é any por enquanto
  async handle(@Body() body: any) {
    console.log(body)

    const { name, email, password } = body

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
