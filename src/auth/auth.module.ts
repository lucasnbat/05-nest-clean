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
    // registerAsync é uma função de configuração como a forRoot()
    JwtModule.registerAsync({
      // injeta o ConfigService, pois vamos usar ele para buscar var ambiente
      inject: [ConfigService],
      global: true,
      // invoca uma função que chama o config service via var config e pega a var
      useFactory(config: ConfigService<EnvType, true>) {
        // keys em base64
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          // usamos o algoritmo rs256, depois codificamos para base64 e mais abaixo vamos fazer decode com Buffer.from()
          signOptions: { algorithm: 'RS256' },
          // converte o texto da base64 para Buffer, uma forma de armanezar dados em memoria no nodejs
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
})
export class AuthModule {}
