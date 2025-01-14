export abstract class HashGenerator {
  // plain: é o plain text, a senha pura passada pelo usuário
  // o hash converte esse plain text para uma senha em hash
  abstract hash(plain: string): Promise<string>
}
