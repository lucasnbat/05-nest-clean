import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswersRepositoryInstance: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepositoryInstance: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepositoryInstance: InMemoryAnswerAttachmentsRepository

let sut: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepositoryInstance =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepositoryInstance = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepositoryInstance,
    )
    inMemoryAnswerCommentsRepositoryInstance =
      new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepositoryInstance,
      inMemoryAnswerCommentsRepositoryInstance,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepositoryInstance.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(inMemoryAnswerCommentsRepositoryInstance.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
