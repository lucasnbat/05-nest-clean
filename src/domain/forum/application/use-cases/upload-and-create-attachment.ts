import { Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hasher-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

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
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {}
}
