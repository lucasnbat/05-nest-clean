import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    // aqui estou só devolvendo uma string em forma de JSON
    // isso é para simular um accessToken...uma implementação bobinha
    // que servirá apenas para testes
    return JSON.stringify(payload)
  }
}
