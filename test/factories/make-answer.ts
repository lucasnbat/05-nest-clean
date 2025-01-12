import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

// override: recebe a versão de AnswerProps onde todos os dados
// são opcionais...isso para que eu não precise informar obrigatoriamente
// tudo para criar uma pergunta para teste
export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: 'Example content',
      ...override, // sobrescreve com a chave/valor que foi recebida no makeAnswer()
    },
    id, // retorna o id manual (se foi passado)
  )

  return answer
}

// Então se você passar:
// const newAnswer = makeAnswer({slug: Slug.create('example')})
// ele vai sobrescrever o example-answer padrão com o 'example' informado
