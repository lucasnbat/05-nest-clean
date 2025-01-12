import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()
    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
    )
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepositoryInstance,
      inMemoryQuestionAttachmentsRepositoryInstance,
    )
  })

  it('should be able to edit a question', async () => {
    // chamando factory que vai criar a pergunta
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepositoryInstance.create(newQuestion)

    // criei com anexos [1,2]
    inMemoryQuestionAttachmentsRepositoryInstance.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    // agora vou editar para ser anexos [1,3], ou seja, removi o
    // 2 e adicionei o 3
    await sut.execute({
      authorId: 'author-1',
      title: 'editei-titulo',
      content: 'editei-conteudo',
      questionId: newQuestion.id.toValue(),
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryQuestionsRepositoryInstance.items[0]).toMatchObject({
      title: 'editei-titulo',
      content: 'editei-conteudo',
    })

    // tem que ter 2 anexos (1 e 3)
    expect(
      inMemoryQuestionsRepositoryInstance.items[0].attachments.currentItems,
    ).toHaveLength(2)

    // o retorno de currentItems precisa ser um vetor contendo os attachmentsIds
    // 1 e 3
    expect(
      inMemoryQuestionsRepositoryInstance.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    // chamando factory que vai criar a pergunta
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepositoryInstance.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      title: 'editei-titulo',
      content: 'editei-conteudo',
      questionId: newQuestion.id.toValue(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
