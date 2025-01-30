import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryQuestionCommentsRepositoryInstance: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepositoryInstance: InMemoryStudentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepositoryInstance = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepositoryInstance =
      new InMemoryQuestionCommentsRepository(inMemoryStudentsRepositoryInstance)

    sut = new FetchQuestionCommentsUseCase(
      inMemoryQuestionCommentsRepositoryInstance,
    )
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    // equivale a usar o create()
    inMemoryStudentsRepositoryInstance.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepositoryInstance.create(comment1)
    await inMemoryQuestionCommentsRepositoryInstance.create(comment2)
    await inMemoryQuestionCommentsRepositoryInstance.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch question comments', async () => {
    // agora sempre que criar questionComment tem que passar o author
    // que no caso será esse student aqui...isso porque se você lembrar
    // la no in memory question comments repo a gente sinalizou que se
    // não tiver author (!author) é pra dar um erro (throw new Error())
    const student = makeStudent({ name: 'John Doe' })

    // equivale a usar o create()
    inMemoryStudentsRepositoryInstance.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepositoryInstance.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    // pedindo por página 2...
    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    // espera-se que só liste 2 registros
    expect(result.value?.comments).toHaveLength(2)
  })
})
