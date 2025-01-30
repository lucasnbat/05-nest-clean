import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsRepositoryInstance: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase
let inMemoryStudentRepositoryInstance: InMemoryStudentsRepository

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentRepositoryInstance = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepositoryInstance =
      new InMemoryQuestionCommentsRepository(inMemoryStudentRepositoryInstance)

    sut = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepositoryInstance,
    )
  })

  it('should be able to delete comment of a question', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepositoryInstance.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepositoryInstance.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepositoryInstance.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
