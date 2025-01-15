import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvType } from './env'

// isso é um serviço utilitario injetavel que serve para pergar o
// config service do nestjs, receber o Env com minhas var ambiente
// no generics dele, depois disponibilizar essas variaveis ambiente
// por meio de um get() que já vai passar elas como infer:true (o que
// significa que eu já fiz a inferencia pra o TS não reclamar)
@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<EnvType, true>) {}

  // Esse get() indica que o parametro enviado pelo usuário no key terá que
  // ser uma das chaves de EnvType, e esse valor será passado para a linha
  // ... return this.configService.get<**T**>(key, { infer: true })

  get<T extends keyof EnvType>(key: T) {
    return this.configService.get<T>(key, { infer: true })
  }
}
