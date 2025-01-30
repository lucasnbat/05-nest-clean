import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepositoryInstance: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let inMemoryStudentRepositoryInstance: InMemoryStudentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryStudentRepositoryInstance = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
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
