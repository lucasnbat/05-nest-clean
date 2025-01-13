// mappers servem para converter uma entidade de um
// formato de uma camada para o formato de outro,
// no caso, converter uma question do prisma para o
// formato da question de domínio que temos em

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'

// domain/forum/enterprise/entities/
export class PrismaQuestionMapper {
  // método que recebe uma question no formato do prisma
  // e devolve uma referencia de memoria a uma question
  // ja existente no formato do dominio
  // sim, o metodo create() na verdade cria uma REFERENCIA
  // a uma question existente aqui, ele não cria uma do zero
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createAt,
        updatedAt: raw.updateAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  // esse QuestionUncheckedCreateInput é uma tipagem apenas com os campos
  // necessários p/ criar uma questão
  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createAt: question.createdAt,
      updateAt: question.updatedAt,
    }
  }
}
