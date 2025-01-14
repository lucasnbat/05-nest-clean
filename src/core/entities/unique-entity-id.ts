// isso aqui é um value-object, mas não está na pasta
// note que praticamente é a mesma estrutura do value-
// object Slug.
// ele vai servir para separar a lógica de geração de IDs
// da aplicação, de forma que se você quiser gerar o ID
// por meio de outra coisa que não seja o randomUUID(),
// você possa fazer sem problema nenhum.
// inclusive você vai poder usar essa classe em qualquer
// atributo das suas entities que estão na pasta entities/

import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  // dois métodos públicos que retornam o value
  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  // valida se o id recebido na função é o mesmo id da classe atual
  // (this)
  equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
