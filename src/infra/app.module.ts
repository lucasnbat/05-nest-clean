import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    // como ele importa o módulo auth aqui, não precisa fazer isso no http
    // module
    AuthModule,
    // contendo todos os controllers, com importações de database module e
    // crytography module
    HttpModule,
  ],
})
export class AppModule {}
