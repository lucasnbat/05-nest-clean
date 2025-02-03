// instale essa lib ioredis
// ela serve para lidar com o Redis e com op. async await (assincronas)
import { Redis } from 'ioredis'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'), // porta padrão redis
      db: envService.get('REDIS_DB'), // cada banco é um número, não nome (banco 0, banco 1...)
    })
  }

  // ao dar new Redis() você já inicializa conexão então não precisa de onModuleInit()
  // quando destruir a instancai do modulo, vou desconcetar do banco redis
  onModuleDestroy() {
    return this.disconnect()
  }
}
