import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

// polimorfismo: fazer com que uma classe se comporte
// de maneira diferente a depender da situação
// No caso, isso pode acontecer de acordo com a mudança
// de valores de parentType por exmeplo:

// interface AttachmentProps {
//   title: string
//   link: string
//   parentId: string
//   parentType: 'answer' | 'question'
// }

interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
