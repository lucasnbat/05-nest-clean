import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'

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
    EnvModule,
  ],
})
export class AppModule {}
