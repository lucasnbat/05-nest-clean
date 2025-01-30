import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { faker } from '@faker-js/faker'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepositoryInstance: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepositoryInstance = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
      inMemoryAttachmentsRepositoryInstance,
      inMemoryStudentsRepository,
    )

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepositoryInstance)
  })

  it('should be able to get question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    // chamando factory que vai criar a pergunta
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })
    inMemoryQuestionsRepositoryInstance.create(newQuestion)

    // cria e salva attachment
    const attachment = makeAttachment({
      title: 'Some attachment',
    })
    inMemoryAttachmentsRepositoryInstance.items.push(attachment)

    // associa pergunta com attachment
    inMemoryQuestionAttachmentsRepositoryInstance.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    // usa a função do caso de uso, agora carregado com o repo. fake
    const result = await sut.execute({
      slug: 'example-question',
    })

    // verificação explícita para o tipo
    if (result.isLeft()) {
      throw new Error(
        'Test failed: expected question, but got ResourceNotFoundError',
      )
    }

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ],
      }),
    })
  })
})
