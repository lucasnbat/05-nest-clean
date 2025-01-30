import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  // passo um valor (true) que vai resultar numa instancia da classe Right
  const result = doSomething(true)

  // aciono o método auxiliar da classe retornada pela função (que no
  // caso é a classe Right) e verifico se isRight() retorna true
  // se sim, só pode significar que é instancia de sucesso (Right) mesmo
  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
