import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvType } from 'src/env'

@Module({
  imports: [
    // importa modulo da Passport (lib de autenticação)
    PassportModule,
    // registerAsync usada para injetar serviços em módulos
    JwtModule.registerAsync({
      // injeta o ConfigService, pois vamos usar ele para buscar var ambiente
      inject: [ConfigService],
      // invoca uma função que chama o config service via var config e pega a var
      useFactory(config: ConfigService<EnvType, true>) {
        console.log(config.get('JWT_SECRET', { infer: true }))

        return {}
      },
    }),
  ],
})
export class AuthModule {}
