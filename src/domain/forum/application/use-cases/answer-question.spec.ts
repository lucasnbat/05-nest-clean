import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerAttachmentsRepositoryInstance: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepositoryInstance: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepositoryInstance =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepositoryInstance = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepositoryInstance,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepositoryInstance)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Contéudo da resposta',
      attachmentsIds: ['1', '2'],
    })

    // lembre que agora result é na verdade uma instância da
    // classe Right {} CONTENDO o value que é o resultado do
    // processamento do use case
    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepositoryInstance.items[0]).toEqual(
      result.value?.answer, // usa ? pois resultado pode ser sucesso ou falha
    )
    expect(
      inMemoryAnswersRepositoryInstance.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryAnswersRepositoryInstance.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
