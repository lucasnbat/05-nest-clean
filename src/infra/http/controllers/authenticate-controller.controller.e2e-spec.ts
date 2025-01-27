import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory

  // isso é a função de inicialização do app http nest
  beforeAll(async () => {
    // cria um módulo de teste ligado ao módulo da aplicação
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    // cria a aplicação nest a partir do moduleRef e associa para a var app
    app = moduleRef.createNestApplication()

    /*
     * gera um client prisma para usar pegando o PrismaService a partir do
     * AppModule
     */
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)

    // inicializa o app em uma porta diferente da porta oficial
    // esse app funcionará apenas para os testes
    await app.init()
  })

  test('[POST] /sessions', async () => {
    // criar usuario que sera usado
    await studentFactory.makePrismaStudent({
      email: 'johndoe@example.com',
      password: await hash('123123', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })

    // const userOnDatabase = await prisma.user.findUnique({
    //   where: {
    //     email: 'johndoe@example.com',
    //   },
    // })

    // // espera-se que retorne um valor válido (não nulo, não undefined)
    // expect(userOnDatabase).toBeTruthy()
  })
})
