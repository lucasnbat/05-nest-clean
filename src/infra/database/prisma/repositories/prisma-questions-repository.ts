import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

// pois vai ser enviado como dependency para algum construtor de outra classe
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private cache: CacheRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    // verifica primeiro se já não tem a info no cache
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    // se cache for diferente de nulo...
    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaQuestionDetailsMapper.toDomain(cacheData)
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    // ex de chave: question:1:details
    // o valor pode ser uma estrutura em JSON como pode ver:
    await this.cache.set(`question:${slug}:details`, JSON.stringify(question))

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    return questionDetails
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    // mapper que converte o formato da question do prisma para
    // formato de question do dominio
    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // pegue sempre 20 itens
      skip: (page - 1) * 20, // sempre pulando de 20 em 20 conforme a page (1,2...)
    })

    return questions.map((question) => {
      return PrismaQuestionMapper.toDomain(question)
    })

    // funcionaria assim também:
    // return questions.map(PrismaQuestionMapper.toDomain)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // o update de id, questões criadas e deleção de questões pode ser
    // feito ao mesmo tempo, ao contrario da criação de um anexo que precisa
    // esperar a criação da pergunta primeiro para ter o id e depois ser
    // associado a pergunta (associação é feita dentro do caso de uso de create
    // question)
    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      // ao editar, invalido o cache (deleta todos os caches da pergunta)
      this.cache.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }
}
