import { AgregateRoot } from '@/core/entities/agregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID // melhor resposta selecionada pelo autor
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList // anexos da pergunta
  createdAt: Date
  updatedAt?: Date
}

// Troquei "extends Entity" por "extends AgregateRoot"
// isso porque question vai participar de um agregado
// e outra: o Agregate Root extende a Entity, então a
// substituição direta de um pelo outro não gera erros
// nos testes. A question é um agregate root porque tudo
// começa nela

// como entidades Question, e tags e anexos são criados e
// editados AO MESMO TEMPO, são agregado.

// Question e answers não são agregados porque são criados
// em momentos diferentes, nem sempre precisam ser ao mesmo
// tempo
export class Question extends AgregateRoot<QuestionProps> {
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

  get attachments() {
    return this.props.attachments
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

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    // if (
    //   this.props.bestAnswerId !== undefined ||
    //   !this.props.bestAnswerId.equals(bestAnswerId)
    // ) {
    //   this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    // }

    if (
      this.props.bestAnswerId === undefined ||
      !bestAnswerId.equals(this.props.bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  // esse método vai agir como o constructor de Entity: passar as props para os
  // atributos e setar um id do tipo UniqueEntityID
  // porque vamos fazer isso? para permitir preenchimento automático do createdAt()
  // usamos o Optional para que não seja preciso passar createdAt ao criar nova question
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(), // sistema gera autpmático
        slug: props.slug ?? Slug.createFromText(props.title), // sistema gera autpmático
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )
    return question
  }
}
