import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete answer (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  // isso é a função de inicialização do app http nest
  beforeAll(async () => {
    // cria um módulo de teste ligado ao módulo da aplicação
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
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
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    // inicializa o app em uma porta diferente da porta oficial
    // esse app funcionará apenas para os testes
    await app.init()
  })

  test('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    // gera access token com nossa instancia jwt passando o user.id como subject
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`) // inserindo o token para usar a rota travada com autenticação
      .send()

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    })

    expect(answerOnDatabase).toBeNull()
  })
})
