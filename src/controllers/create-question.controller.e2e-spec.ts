import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create account (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

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

    // instancia o jwtService, que ele quem cria o token para você (função sign())
    jwt = moduleRef.get(JwtService)

    // inicializa o app em uma porta diferente da porta oficial
    // esse app funcionará apenas para os testes
    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123123', 8), // gera o hash da senha
      },
    })

    // gera access token com nossa instancia jwt passando o user.id como subject
    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`) // inserindo o token para usar a rota travada com autenticação
      .send({
        title: 'New question',
        content: 'Content of question',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
