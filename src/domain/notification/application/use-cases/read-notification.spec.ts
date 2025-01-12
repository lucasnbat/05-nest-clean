import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepositoryInstance: InMemoryNotificationsRepository

let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepositoryInstance =
      new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepositoryInstance)
  })

  it('should be able to read a notification', async () => {
    // usa a função do caso de uso, agora carregado com o repo. fake
    const notification = makeNotification()

    await inMemoryNotificationsRepositoryInstance.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })
    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepositoryInstance.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read an notification from another user', async () => {
    // chamando factory que vai criar a pergunta
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    inMemoryNotificationsRepositoryInstance.create(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
