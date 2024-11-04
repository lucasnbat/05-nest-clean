import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// adicionar algo aqui faz virar prefixo para todas as rotas 
@Controller('/api')
export class AppController {
  // conceito de inversão de dependência aqui, recebe AppService como prop.
  constructor(private readonly appService: AppService) { }

  @Get('/hello')
  index(): string {
    return this.appService.getHello();
  }
}
