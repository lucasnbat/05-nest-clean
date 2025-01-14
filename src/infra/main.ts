import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { EnvType } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  // app.get pega algum serviço (config module é um serviço do ConfigModule
  // que está no app.module.ts)
  // aparentemente é um plugin automático disponibilizado ao importar o módulo
  // ConfigModule.forRoot()

  // dentro do generic de ConfigService você passa primeiro a tipagem
  // depois se já foi validado ou não. coloca true para sinalizar que já validou
  // que a portal não vai ser undefined (o que é verdade, porque em ultimo caso
  // ela sempre será o valor padrão 3333)
  const configService = app.get<ConfigService<EnvType, true>>(ConfigService)

  // usa o plugin para pegar a var. ambiente PORT
  const port = configService.get('PORT', {
    infer: true,
  })

  await app.listen(port)
}
bootstrap()
