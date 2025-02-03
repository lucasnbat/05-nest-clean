import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  // como uso o env service no redis.service.ts, preciso importar
  imports: [EnvModule],
  providers: [EnvService],
})
export class CacheModule {}
