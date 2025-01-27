// Essa classe vai funcionar como se fosse uma tabela
// pivô no banco, aquelas que fazemos em relacionamentos N:M
// Mas isso é só para analogia... não necessariamente vai ser
// isso ao modelar o BD.
// É uma classe feita para CONECTAR a classe attachment.ts com
// a Question sem usar o polimorfismo

import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const attachment = new QuestionAttachment(props, id)

    return attachment
  }
}
