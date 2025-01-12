import { AgregateRoot } from '../entities/agregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// classe que representa a criação de um CustomAggregate
class CustomAggregateCreated implements DomainEvent {
  // informações que estou anotando do evento: data e o
  // proprio objeto agregado
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

// CustomAggregate = um agregado qualquer, como o de pergunta
// como ele extende AgregateRoot, é como se ele tivesse tudo
// aquilo que tem no AgregateRoot: ele tem uma lista vetorial
// com todos os eventos pendentes dele
// o método addDomainEvent() permite puxar um evento novo para
// essa lista passando uma classe que representa esse evento,
// no caso, a CustomAggregateCreated
// Esse método create() estático permite criar uma instância
// da própria classe e usar o addDomainEvent para registrar esse
// evento (a criação da instância) e retorna o agregado
class CustomAggregate extends AgregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    // adiciona o evento na lista de eventos que aconteceram
    // passando a classe CusttomAggregateCreated com as informações
    // do aggregate criado.
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    // função spy: retorna info. apenas se foi chamada
    const callbackSpy = vi.fn()

    // to registrando um tipo de evento com o nome dele lá no handlersMap
    // do DomainEvents, que está aqui como uma classe que eu usei para
    // simplesmente invocar o seu método register()
    // veja que, para um evento com o nome da classe CustomAggregateCreated
    // (ou seja, ele vai se chamar "CustomAggregateCreated"), uma função
    // foi associada para ser disparada (minha função spy)
    // Diego: [Subscriber cadastrado ouvindo o evento "resposta criada"]
    // Diego: [DOMINIO DE NOTIFICAÇÃO]
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // agora eu estou criando uma instância da classe CustomAggregate,
    // e a lógica desse método estatico create() faz com que ele use
    // o addDomainEvent()
    // Ao usar esse método passando uma instância dele mesmo, o que
    // acontece é que ele vai para o vetor interno de CustomAggregate
    // (_domainEvents), além de marcar essa classe como uma das que
    // tem eventos pendentes por meio do método
    // DomainEvents.markAggregateForDispatch(this)
    // Diego: [Crio resposta sem salvar no banco]
    // Diego: [DOMÍNIO DE FORUM]
    const aggregate = CustomAggregate.create()

    // Logo, é esperado que pelo menos tenha um evento lá em _domainEvents
    // dentro da classe CustomAggregate
    // Diego: [assegurando que evento foi criado mas não disparado]
    // Diego: [DOMÍNIO DE FORUM]
    expect(aggregate.domainEvents).toHaveLength(1)

    // Diego: [Salvando a resposta no banco de dados e disparando evento]
    // Diego: [Subscriber ouve o evento e dispara a função(no caso, a spy)]
    // O disparo da função é feito dentro de DomainEvents.dispatch()
    // Diego: [DOMÍNIO DE FORUM]
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
