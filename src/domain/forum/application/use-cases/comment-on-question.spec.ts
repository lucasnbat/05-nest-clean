import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepositoryInstance: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let inMemoryStudentRepositoryInstance: InMemoryStudentsRepository
let inMemoryAttachmentsRepositoryInstance: InMemoryAttachmentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryStudentRepositoryInstance = new InMemoryStudentsRepository()

    inMemoryAttachmentsRepositoryInstance = new InMemoryAttachmentsRepository()

    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
      inMemoryAttachmentsRepositoryInstance,
      inMemoryStudentRepositoryInstance,
    )

    inMemoryQuestionCommentsRepositoryInstance =
      new InMemoryQuestionCommentsRepository(inMemoryStudentRepositoryInstance)

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepositoryInstance,
      inMemoryQuestionCommentsRepositoryInstance,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepositoryInstance.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(inMemoryQuestionCommentsRepositoryInstance.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
