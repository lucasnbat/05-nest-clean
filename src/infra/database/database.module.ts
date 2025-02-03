import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

@Module({
  providers: [
    PrismaService,
    // isso abaixo indica para, quando ver QuestionsRepository, usar a classe
    // PrismaQuestionsRepository no lugar. Para isso, fiz as adaptações neces-
    // sárias em questions-repository.ts transformando-a em abstract class
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  // necessário para o http.module.ts acessar e passar para controllers
  exports: [
    PrismaService,
    // No lugar de PrismaQuestionsRepository substitui por QuestionsRepository
    // O nestjs vai entender ao olhar para o objeto de cima da chave providers
    // que ao ver QuestionsRepository ele deve usar PrismaQuestionsRepository
    QuestionsRepository,
    StudentsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswersRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
