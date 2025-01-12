import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  // serve para registrar um subscriber no handlersMap do DomainEvents
  setupSubscriptions(): void {
    // passa qual função disparar quando o evento for acionado
    DomainEvents.register(
      // o bind() serve para que, quando a dispacth lá do DomainEvents for
      // disparar, ela reconheça que THIS não vai ser a classe DomainEvents,
      // mas sim ESSA classe aqui, a OnAnswerCreated
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )

    // você pode ter mais eventos registrados, por ex:
    // DomainEvents.register(this.sendBestAnswerNotification, BestAnswerSelected.name)
    // (...)
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      // executando o caso de uso de envio de notificação
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
