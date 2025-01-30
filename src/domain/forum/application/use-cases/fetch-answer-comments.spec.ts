import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentsRepositoryInstance: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase
let inMemoryStudentsRepositoryInstance: InMemoryStudentsRepository

describe('Fetch Answer Comments', () => {
  inMemoryStudentsRepositoryInstance = new InMemoryStudentsRepository()
  beforeEach(() => {
    inMemoryAnswerCommentsRepositoryInstance =
      new InMemoryAnswerCommentsRepository(inMemoryStudentsRepositoryInstance)

    sut = new FetchAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepositoryInstance,
    )
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepositoryInstance.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepositoryInstance.create(comment1)
    await inMemoryAnswerCommentsRepositoryInstance.create(comment2)
    await inMemoryAnswerCommentsRepositoryInstance.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepositoryInstance.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepositoryInstance.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    // pedindo por página 2...
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    // espera-se que só liste 2 registros
    expect(result.value?.comments).toHaveLength(2)
  })
})
