import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { faker } from '@faker-js/faker'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
    )

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepositoryInstance)
  })

  it('should be able to get question by slug', async () => {
    // chamando factory que vai criar a pergunta
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create('example-question'),
    })

    inMemoryQuestionsRepositoryInstance.create(newQuestion)
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

    expect(result.value?.question.id).toBeTruthy()

    // verificar se a question retornada pela pesquisa via slug é a mesma
    // que foi criada por nós
    expect(result.value?.question.title).toEqual(newQuestion.title)
  })
})
