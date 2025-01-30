import { Slug } from './value-objects/slug'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID // melhor resposta selecionada pelo autor
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // se pergunta for de no max 3 dias, marcada como nova
  // esse isNew apesar de não estar nas props vira acessível (Question.create({}))
  // ou seja ela aparece para selecionar e informar ao usar o create()
  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  // resumo da resposta limitado a 120 caracteres, sem espaço no fim e com
  // '...' no final
  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  // método criado para vigiar e setar datas de alteração de informação
  private touch() {
    this.props.updatedAt = new Date()
  }

  // se atualizar titulo atualiza o slug automaticamente
  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  // esse método vai agir como o constructor de Entity: passar as props para os
  // atributos e setar um id do tipo UniqueEntityID
  // porque vamos fazer isso? para permitir preenchimento automático do createdAt()
  // usamos o Optional para que não seja preciso passar createdAt ao criar nova question
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title), // sistema gera autpmático
        createdAt: props.createdAt ?? new Date(), // sistema gera autpmático
      },
      id,
    )
    return question
  }
}
