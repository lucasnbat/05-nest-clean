import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { DatabaseModule } from '@faker-js/faker/.'
import { Module } from '@nestjs/common'

@Module({
  // exportar providers de banco de dados
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    // usado como dep. nos dois acima
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
