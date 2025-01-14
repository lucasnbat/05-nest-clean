import { HashComparer } from '@/domain/forum/application/cryptography/hasher-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator'
import { hash, compare } from 'bcryptjs'

// veja o quanto gateways de criptografia são parecidos com os repositorios:
// você implementa contratos e configura conforme a tecnologia de criptografia
// que deseja. É como um prisma-questions-repository. Se amanhã você quiser
// usar outra coisa que não seja o bcrypt para cifrar senhas ou gerar tokens,
// é só mudar a implementação aqui
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
