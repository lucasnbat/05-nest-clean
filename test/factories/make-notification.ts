import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

// override: recebe a versão de NotificationProps onde todos os dados
// são opcionais...isso para que eu não precise informar obrigatoriamente
// tudo para criar uma pergunta para teste
export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override, // sobrescreve com a chave/valor que foi recebida no makeNotification()
    },
    id, // retorna o id manual (se foi passado)
  )

  return notification
}

// Então se você passar:
// const newNotification = makeNotification({slug: Slug.create('example')})
// ele vai sobrescrever o example-notification padrão com o 'example' informado
