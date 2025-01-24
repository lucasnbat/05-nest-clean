import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

// override: recebe a versão de QuestionProps onde todos os dados
// são opcionais...isso para que eu não precise informar obrigatoriamente
// tudo para criar uma pergunta para teste
export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const question = Question.create(
    {
      title: 'Example question',
      slug: Slug.create('example-question'),
      authorId: new UniqueEntityID(),
      content: 'Example content',
      ...override, // sobrescreve com a chave/valor que foi recebida no makeQuestion()
    },
    id, // retorna o id manual (se foi passado)
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}

// Então se você passar:
// const newQuestion = makeQuestion({slug: Slug.create('example')})
// ele vai sobrescrever o example-question padrão com o 'example' informado
