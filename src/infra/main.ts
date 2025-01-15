import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  // app.get pega algum serviço (config module é um serviço do ConfigModule
  // que está no app.module.ts)
  // aparentemente é um plugin automático disponibilizado ao importar o módulo
  // ConfigModule.forRoot()

  // invoca o EnvService que retorna as var ambiente com infer:true
  const envService = app.get(EnvService)

  // usa o serviço para pegar uma variavel e setar em const port;
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
