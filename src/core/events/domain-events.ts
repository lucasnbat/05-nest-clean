import { AgregateRoot } from '../entities/agregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'

import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  // handlersMap tem o nome do evento (string) e a função que será chamada
  // ao checar o nome do evento (ela sera do tipo DomainEventCallback)
  // É um vetor de funções do tipo DomainEventCallback porque posso ter vários
  // subscribers com várias funções que podem ser chamadas dependendo do
  // evento (tipo string) que é detectado
  // O handlersMap é o Subscriper...ele que fica ouvindo os eventos e, a
  // depender do nome da classe do evento que tem (uma string) ele dispara
  // uma função diferente (do tipo DomainEventCallBack)
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  // marca quais agregados da aplicação tem eventos pendentes (ex: answers
  // que já estão salvas no BD e que estão com ready = true, mas ainda não
  // foram disparados )
  // deveria se chamar markedAggregatesForDespatch
  private static markedAggregates: AgregateRoot<unknown>[] = []

  public static shouldRun = true

  // serve para marcar o agregado dentro do array acima (markedAgreggates)
  public static markAggregateForDispatch(aggregate: AgregateRoot<unknown>) {
    // se não achou o agregado com id passado na lista, agreggateFound = false
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    // !false = true -> agregado sera adicionado na lista de eventos pendentes
    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  // método que será chamado pelo banco de dados para fazer o ready ficar
  // true e fazer o subscriber disparar o evento de notificação, por ex
  // É o método que dispara os eventos de um agregado marcado na lista de
  // markedAggregates
  private static dispatchAggregateEvents(aggregate: AgregateRoot<unknown>) {
    // veja que ele vai pegar a minha resposta, o meu agregado, ir dentro
    // dos eventos que ele pré disparou com addDomainEvent() e disparar um
    // a um
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AgregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    this.markedAggregates.splice(index, 1)
  }

  // função utilitaria para achar id do agreggate marcado como pendente
  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AgregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  // aqui parece uma superfunção que recebe agregados e dispara todos os eventos
  // de cada um.
  // Leia-se "dispare eventos de cada agregado da markedAggregates"
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      // pega agregado e dispara todos os eventos pre disparados dele
      // ou seja, ele vai no vetor _domainEvents do agregado, usa o nome
      // das classes armazenadas lá para buscar se tem algum evento desse
      // nome cadastrado no handlersMap e depois dispara
      this.dispatchAggregateEvents(aggregate)

      // limpa a lista de eventos do agregado
      aggregate.clearEvents()

      // remove o agregado da lista de agregados que tem eventos pendentes
      // de disparo
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  // o register registra um subscriber dentro do handlersMap
  //
  public static register(
    callback: DomainEventCallback, // a função callback

    eventClassName: string, // o nome da classe
  ) {
    // verifica se a classe do evento já está na lista handlersMap
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    // se false, !false vai dar true e vai adicionar ele na lista
    if (!wasEventRegisteredBefore) {
      // aparentemente inicializa uma chave com o nome do evento
      this.handlersMap[eventClassName] = []
    }

    // e adiciona o callback para aquele evento
    // ou seja, para o evento UserCreated eu posso ter uma função
    // sendNotification()
    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  private static dispatch(event: DomainEvent) {
    // pega o nome da classe do evento: por exemplo, CustomAggreagateCreated
    const eventClassName: string = event.constructor.name

    // busca em handlersMap se o nome do evento está associado
    // com alguma função callback, se sim, retorna true
    const isEventRegistered = eventClassName in this.handlersMap

    if (!this.shouldRun) {
      return
    }

    // se eu tiver isso:
    // handlersMap = {
    //   "UserHasCreated": [callback1, callback2],
    // };
    if (isEventRegistered) {
      // essa linha abaixo vai retornar:
      // [callback1, callback2]
      const handlers = this.handlersMap[eventClassName]

      // loop no vetor pegando cada função callback e acionando
      // passando o evento
      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}

/**
 * markAggregateForDispatch (manda para markedAggregates) -> markedAggregates (agregados com eventos pendentes) 
 * -> dispatchEventsForAggregate [busca agregado por ID, e manda para o...] -> dispatchAggregateEvents (pega cada evento
 * do agregado e usa dispatch() para acionar cada call-back desse evento) -> após o dispatchEventsForAggregate vai limpar
 * os eventos pendentes dentro do agregado e remover da lista de agregados com eventos pendentes

 * handlersMap: vetor com nomes de evento e funções a cada posição
 * removeAggregateFromMarkedDispatchList: remove da lista de agregados com eventos pendentes
 * findMarkedAggregateById: função utilitaria para achar id do agreggate marcado como pendente
 * register: o register registra um subscriber dentro do handlersMap e pusha uma função de call
	 back para dentro de uma chave criada com o nome da classe do evento. Assim fica
	 associado que para evento x temos y função call-back a ser chaamda quando o evento
	 ocorre.
 * dispacth: função com o trabalho de acessar as chaves de eventos registradas pelo register no
 * handlersMap e executar os call-backs armazenados dentro dessa chave 

 * Nota: por chave estou querendo dizer o slot do vetor. Para um vetor [_, _, _] temos três chaves
   (slots vazios) e cada um pode ter vários eventos dentro
 */
