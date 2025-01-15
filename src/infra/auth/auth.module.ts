// o que esse módulo faz é configurar e disponibilizar chaves public e private
// para haver a geração do token em outro lugar (authenticate-controller)

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    // importa modulo da Passport (lib de autenticação)
    PassportModule,
    // registerAsync usada para injetar serviços em módulos
    // registerAsync é uma função de configuração como a forRoot()
    // provavelmente é graças ao JwtModule que conseguimos fazer o jwtDependency
    // chamar toda essa maquinaria do auth.module.ts aqui embaixo
    JwtModule.registerAsync({
      // injeta o ConfigService, pois vamos usar ele para buscar var ambiente
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      // invoca uma função que chama o config service via var config e pega a var
      useFactory(env: EnvService) {
        // keys em base64
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          // usamos o algoritmo rs256, depois codificamos para base64 (nos outros arquivos que fizemos isso)
          // e agora abaixo vamos fazer decode com Buffer.from()
          signOptions: { algorithm: 'RS256' },
          // converte o texto da base64 para Buffer, uma forma de armanezar dados em memoria no nodejs
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD, // verifica quais rotas o user pode acessar ou não
      useClass: JwtAuthGuard, // nossa classe de guard
    },
    JwtStrategy,
    EnvService,
  ],
})
export class AuthModule {}
