import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  // pega o identificaodr e constroi a mensagem de erro
  // como aqui eu tenho um construtor, preciso usar super() pra chamar o
  // construtor da classe Error {}
  // esse não é o caso de answer, aggregate-root e entity...lá a answer não
  // tem construtor,o que faz com que o simples instanciação da answer dentro
  // do método create() estático invoque o construtor de Entity
  constructor(identifier: string) {
    super(`Student ${identifier} already exists.`)
  }
}
