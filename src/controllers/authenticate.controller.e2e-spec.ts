import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  // isso é a função de inicialização do app http nest
  beforeAll(async () => {
    // cria um módulo de teste ligado ao módulo da aplicação
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    // cria a aplicação nest a partir do moduleRef e associa para a var app
    app = moduleRef.createNestApplication()

    /*
     * gera um client prisma para usar pegando o PrismaService a partir do
     * AppModule
     */
    prisma = moduleRef.get(PrismaService)

    // inicializa o app em uma porta diferente da porta oficial
    // esse app funcionará apenas para os testes
    await app.init()
  })

  test('[POST] /sessions', async () => {
    // criar usuario que sera usado
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123123', 8), // gera o hash da senha
      },
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
