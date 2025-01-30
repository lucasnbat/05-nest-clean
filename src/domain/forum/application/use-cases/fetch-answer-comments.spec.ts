import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepositoryInstance: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepositoryInstance =
      new InMemoryAnswerCommentsRepository()

    sut = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepositoryInstance,
    )
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepositoryInstance.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepositoryInstance.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepositoryInstance.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepositoryInstance.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    // pedindo por página 2...
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    // espera-se que só liste 2 registros
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
