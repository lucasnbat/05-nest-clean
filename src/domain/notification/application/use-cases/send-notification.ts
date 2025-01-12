import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      // na requisição vai vir como string, mas a classe processa como
      // UniqueEntityID, o que faz necessário converter a string para isso
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    // passa para a parte de infra que vai salvar (prisma, TypeOrm...)
    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
