import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

// isso é o repositório fake em memória tipado com a estrutura
// do repositório em `test/repositories/in-memory-questions-repository
// que por sua vez implementa o contrato/classe em
// `application/repositories/questions-repository.ts`
let inMemoryQuestionsRepositoryInstance: InMemoryQuestionsRepository

let inMemoryQuestionAttachmentsRepositoryInstance: InMemoryQuestionAttachmentsRepository

// aqui é o caso de uso com a regra de negóio...ele vai usar o repositório
// instanciado anteriormente. Ele (o caso de uso) é o s.u.t (system under
// test). Você pode renomear para sut se quiser
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepositoryInstance =
      new InMemoryQuestionAttachmentsRepository()

    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryQuestionsRepositoryInstance = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepositoryInstance,
    )

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepositoryInstance)
  })

  it('should be able to create a question', async () => {
    // usa a função do caso de uso, agora carregado com o repo. fake
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepositoryInstance.items[0]).toEqual(
      result.value?.question,
    )
    expect(
      inMemoryQuestionsRepositoryInstance.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(
      inMemoryQuestionsRepositoryInstance.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
