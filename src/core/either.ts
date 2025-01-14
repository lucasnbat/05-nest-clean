// Error
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  // métodos auxiliares criados durante os testes da classe
  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

// Success
export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  // métodos auxiliares criados durante os testes da classe
  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

// criando tipagem que pode apontar para classes Left ou Right
// Associa cada classe a uma letra e tipa as classes que tão acima
export type Either<L, R> = Left<L, R> | Right<L, R>

// funções que vão instanciar as classes (poderiam ser métodos static tb)
// depois temos a tipagem de valores de entrada <L, R>
// depois temos a tipagem de valores de saída (Either<L,R>)
export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
