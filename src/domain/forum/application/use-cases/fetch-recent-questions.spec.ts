import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { faker } from '@faker-js/faker'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
    )

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepositoryInstance)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepositoryInstance.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepositoryInstance.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepositoryInstance.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepositoryInstance.create(makeQuestion())
    }

    // pedindo por página 2...
    const result = await sut.execute({ page: 2 })

    // espera-se que só liste 2 registros
    expect(result.value?.questions).toHaveLength(2)
  })
})
