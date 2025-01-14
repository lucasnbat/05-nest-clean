import { HashComparer } from '@/domain/forum/application/cryptography/hasher-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    // aqui estou simulando uma mudança no texto (o que a criptografia
    // faz, no final das contas), mas com uma modif. mais simples
    return plain.concat('-hashed')
  }

  // aqui temos só a simulação de comparação de um texto plain (ex:
  // senha-hashed) com um texto que já tem o -hashed adicionado nele
  // (esse texto está armazenado na variável hash recebida pela função)
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
