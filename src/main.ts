import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // tirar logs ao iniciar servidor
  })
  await app.listen(process.env.PORT ?? 3333)
}
bootstrap()
