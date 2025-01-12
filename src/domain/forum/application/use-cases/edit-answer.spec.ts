import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepositoryInstance: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepositoryInstance: InMemoryAnswerAttachmentsRepository

let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepositoryInstance =
      new InMemoryAnswerAttachmentsRepository()

    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryAnswersRepositoryInstance = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepositoryInstance,
    )

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepositoryInstance,
      inMemoryAnswerAttachmentsRepositoryInstance,
    )
  })

  it('should be able to edit a answer', async () => {
    // chamando factory que vai criar a pergunta
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepositoryInstance.create(newAnswer)

    inMemoryAnswerAttachmentsRepositoryInstance.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      content: 'editei-conteudo',
      answerId: newAnswer.id.toValue(),
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryAnswersRepositoryInstance.items[0]).toMatchObject({
      content: 'editei-conteudo',
    })

    expect(
      inMemoryAnswersRepositoryInstance.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(
      inMemoryAnswersRepositoryInstance.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    // chamando factory que vai criar a pergunta
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepositoryInstance.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      content: 'editei-conteudo',
      answerId: newAnswer.id.toValue(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
