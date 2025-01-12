import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswersRepositoryInstance: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepositoryInstance: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepositoryInstance =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepositoryInstance = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepositoryInstance,
    )

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepositoryInstance)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepositoryInstance.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepositoryInstance.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepositoryInstance.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepositoryInstance.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    // pedindo por página 2...
    const result = await sut.execute({ questionId: 'question-1', page: 2 })

    // espera-se que só liste 2 registros
    expect(result.value?.answers).toHaveLength(2)
  })
})
