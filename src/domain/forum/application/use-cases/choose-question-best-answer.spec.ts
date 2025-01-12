import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryAnswersRepositoryInstance: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepositoryInstance: InMemoryAnswerAttachmentsRepository

let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepositoryInstance =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
    )
    inMemoryAnswersRepositoryInstance = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepositoryInstance,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepositoryInstance,
      inMemoryAnswersRepositoryInstance,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepositoryInstance.create(question)
    await inMemoryAnswersRepositoryInstance.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionsRepositoryInstance.items[0].bestAnswerId).toEqual(
      answer.id,
    )
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepositoryInstance.create(question)
    await inMemoryAnswersRepositoryInstance.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    // Nesse caso aqui o result é uma instancia de Left { } contendo o
    // NotAllowedError

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
