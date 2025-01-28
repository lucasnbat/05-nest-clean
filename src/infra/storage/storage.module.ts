import { Uploader } from '@/domain/forum/application/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { EnvModule } from '../env/env.module'

@Module({
  // EnvModule é o que expoe as var ambiente por meio do env service
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  // aparentemente é isso... você exporta o uploader ou a classe geral
  // e quando o caso de uso for utilizar ela, você redireciona para a
  // classe de implementação que tá em useClass
  exports: [Uploader],
})
export class StorageModule {}
