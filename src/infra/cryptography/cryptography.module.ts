import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hasher-comparer'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator'

@Module({
  providers: [
    // sempre que houver classe que segue esse contrato Encrypter,
    // use o JwtEncrypter
    { provide: Encrypter, useClass: JwtEncrypter },
    // sempre que houver classe que segue esse contrato HashComparer,
    // ou HashGenerator, use o BcryptHasher
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
