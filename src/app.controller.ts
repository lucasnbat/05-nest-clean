import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

// adicionar algo aqui faz virar prefixo para todas as rotas
@Controller('/api')
export class AppController {
  // conceito de inversão de dependência aqui, recebe AppService como prop.
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('/hello')
  index(): string {
    return this.appService.getHello()
  }

  @Post('/hello')
  async store() {
    return await this.prisma.user.findMany()
  }
}
