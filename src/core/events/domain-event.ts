import { UniqueEntityID } from '../entities/unique-entity-id'

// Domain event é tipo um contrato de tipagem que especifica o que
// um evento de dominio deve ter
// Evento de exemplo: notificação de melhor resposta, notificação
// de que pergunta foi respondida...
export interface DomainEvent {
  ocurredAt: Date // quando ocorreu

  getAggregateId(): UniqueEntityID // ID da entidade que disparou o evento
}
