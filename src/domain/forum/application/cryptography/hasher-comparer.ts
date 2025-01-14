export abstract class HashComparer {
  // compara uma senha com o hashing no banco e devolve se é
  // true (batem) ou não
  abstract compare(plain: string, hash: string): Promise<boolean>
}
