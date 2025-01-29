import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments) // ... porque são varios attachments
  }

  // recebe uma lista de anexos
  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    // vou pegar os itens e buscar os que são iguais aos da lista recebida
    // depois vou inverter essa lógica e pegar apenas os elementos de de items[]
    // que NÃO ESTÃO na lista recebida no método
    // ou seja, no fim só fica os items que não foram atingidos pela lista
    // de itens enviados para remoção
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
