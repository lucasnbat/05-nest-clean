import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  authorId: UniqueEntityID
  author: string
  createdAt: Date
  updatedAt?: Date | null
}

// Entenda que isso é diferente de um QuestionComment, essa classe representa
// um aglomerado de informações e não tem ID porque o que vai diferenciar uma
// instancia dela de outra instancia são as informações nas propriedades
// (um CommentWithAuthor vai se diferenciar de outro porque um é do Lucas e
// outro é da Laura, por ex.)
export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  // para toda informação que você quer buscar dessa classe1
  // no front, crie um get. Na hora de serializar em JSON vai facilitar
  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get author() {
    return this.props.author
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // vantagens od metodo static create() --> acessa as props e permite fazer
  // validações com elas ou até modificar elas
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
