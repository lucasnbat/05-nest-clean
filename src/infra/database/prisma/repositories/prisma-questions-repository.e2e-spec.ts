import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Prisma questions repository (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let attachmentFactory: AttachmentFactory
  let questionsRepository: QuestionsRepository
  let cacheRepository: CacheRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        QuestionAttachmentFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  test('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({})

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toEqual(JSON.stringify(questionDetails))
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })
    const slug = question.slug.value
    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }), // simula qq adição de detalhes, texto, etc
    )
    const questionDetails = await questionsRepository.findDetailsBySlug(slug)
    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const attachment = await attachmentFactory.makePrismaAttachment()
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })
    const slug = question.slug.value
    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )
    await questionsRepository.save(question)
    const cached = await cacheRepository.get(`question:${slug}:details`)
    expect(cached).toBeNull()
  })
})
