import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// esse arquivo equivale ao
// const prismaClient = new PrismaClient()
// no fastify. pegar uma instancia do PrismaClient e disponibilizar para uso

// @Injectable()
// export class PrismaService {
//   // atributo e tipagem
//   public client: PrismaClient

//   // instanciação com construtor
//   constructor() {
//     this.client = new PrismaClient()
//   }
// }

// essa é a versão final. veja que extendo as props de PrismaClient e apenas
// chamo os métodos dela com o super() (ele chama o constructor da PrismaClient)
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public client: PrismaClient

  constructor() {
    super({
      log: ['error', 'warn'],
    })
  }

  // nest chama isso ao instanciar módulo que usa esse serviço for criado
  onModuleInit() {
    return this.$connect // conecte com prisma
  }

  onModuleDestroy() {
    return this.$disconnect // desconecta com prisma ao módulo ser destruído
  }
}
