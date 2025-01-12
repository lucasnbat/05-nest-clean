import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

// isso é o repositório fake em memória tipado com a estrutura
// do repositório em `test/repositories/in-memory-notifications-repository
// que por sua vez implementa o contrato/classe em
// `application/repositories/notifications-repository.ts`
let inMemoryNotificationsRepositoryInstance: InMemoryNotificationsRepository

// aqui é o caso de uso com a regra de negóio...ele vai usar o repositório
// instanciado anteriormente. Ele (o caso de uso) é o s.u.t (system under
// test). Você pode renomear para sut se quiser
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    // inicializa o repositório fake que simula a infra/maquinaria
    inMemoryNotificationsRepositoryInstance =
      new InMemoryNotificationsRepository()

    // inicializa o caso de uso e arma ele com o repositório recém carregado
    sut = new SendNotificationUseCase(inMemoryNotificationsRepositoryInstance)
  })

  it('should be able to send a notification', async () => {
    // usa a função do caso de uso, agora carregado com o repo. fake
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepositoryInstance.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
