import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AgregateRoot<Props> extends Entity<Props> {
  // todo agregado anota dentro dele os eventos que ele disparou
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  // pré dispara o evento: apenas anota na estrutura de dados que
  // o evento existe, mas com ready = false, sem estar marcado como
  // evento pendente de disparar notificação
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
