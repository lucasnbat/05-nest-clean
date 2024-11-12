import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvType } from 'src/env'
import { z } from 'zod'

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayloadType = z.infer<typeof userPayloadSchema>

// criando uma classe que extende as caract. de PassportStrategy
// aparentemente essa PassportStrategy é uma classe de configuração geral,
// que recebe a Strategy que vem de passport-jwt. Ou seja, ela está nesse
// momento identificando qual é a strategy a ser usada

// essa classe será injetável, pois, apesar de que não usaremos @UsePipes, e
// sim @UseGuards, ela não é um módulo, e tudo que não é módulo, deve ser impor-
// tado como providers. Nesse caso, nos providers do auth.module.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // aqui importamos a var config contendo a tipagem do nosso .env
  constructor(config: ConfigService<EnvType, true>) {
    // usamos a var para pegar a cahve publica;
    // lembre: esse arquivo valida se o usuário está logado, então apenas
    // precisamos DECODIFICAR um token, e não gerar um. Logo, basta a chave
    // publica.
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    // chama o constructor de PassportStrategy
    super({
      // aqui passamos que queremos extrair token do header Authorization,
      // tipo bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // passamos a chave convertida de base64
      secretOrKey: Buffer.from(publicKey, 'base64'),
      // passamos o tipo do algoritmo
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayloadType) {
    return userPayloadSchema.parse(payload)
  }
}
