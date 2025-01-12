import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

// classe abstrata: ela não pode ser instanciada...
// sempre precisa ser extendida para instanciar a classe que extende

// <Props extends CommentProps> permite que você crie um Props que extende
// o CommentProps, de forma que se você quiser passar uma prop específica da
// classe que extende Comment, voce faça sem problemas
export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // método criado para vigiar e setar datas de alteração de informação
  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }
}
