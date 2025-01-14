import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Module({
  providers: [
    PrismaService,
    // isso abaixo indica para, quando ver QuestionsRepository, usar a classe
    // PrismaQuestionsRepository no lugar. Para isso, fiz as adaptações neces-
    // sárias em questions-repository.ts transformando-a em abstract class
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
  // necessário para o http.module.ts acessar e passar para controllers
  exports: [
    PrismaService,
    // No lugar de PrismaQuestionsRepository substitui por QuestionsRepository
    // O nestjs vai entender ao olhar para o objeto de cima da chave providers
    // que ao ver QuestionsRepository ele deve usar PrismaQuestionsRepository
    QuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
