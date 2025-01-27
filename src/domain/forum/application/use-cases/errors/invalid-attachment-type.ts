import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachmentType extends Error implements UseCaseError {
  // o construtor aqui tem o super() que invoca o construtor da classe pai
  // (Error). A Error é uma classe que já suporta receber mensagem, então
  // meio que não precisaria da UseCaseError implementada aqui... segui apenas
  // por precaução.
  constructor(type: string) {
    super(`File type ${type} is not valid`)
  }
}
