import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

// Esse caso de uso destina-se a ser o salvamento de um attachment puro, que
// ainda não foi associado a nenhuma pergunta ou resposta. É o caso de uso
// que vai salvar o attachment para gerar o ID no banco (depois usaremos esse ID)
interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  // poderia ser base64, stream, etc - Buffer armazena o conteudo
  // do arquivo em memória durante o upload, então é melhor usar
  // em arquivos menores. Para arquivos maiores (vídeo por ex) é
  // melhor usar stream de dados
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // se não bater com o regex...
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      // retorna erro de tipo inválido
      return left(new InvalidAttachmentType(fileType))
    }

    // realiza o upload
    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    // cria o objeto
    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    // salva no banco (lembre que dentro do repo do prisma
    // vai haver um mapper que vai transformar o objeto de dominio
    // que criamos acima em objeto prisma)
    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
