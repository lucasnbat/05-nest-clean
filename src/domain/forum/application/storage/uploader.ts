// Isso é um utilitário parecido com os gateways de criptografia
// e repositórios em geral, ele vai servir para executar a função
// de contrato de um uploader que vai subir os arquivos

// CHUTE/ hipótese:
// ou seja, depois eu vou poder, no NestJS, falar que para essa
// classe (provider: Uploader) seja redirecionado o uso de uma
// outra classe que contenha uma maquinaria de infra especifica
// (useClass: ExemploDeFerramentaDeUpload {})

// CHUTE/ hipótese:
// usamos uma maquinaria fake para testar (ex: in-memory-uploader)
export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
