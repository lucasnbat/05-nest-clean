import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class GetQuestionBySlugController {
  //   constructor() {}

  @Post()
  // usado para upload de arquivos usando multer
  // 'file' é o nome dado ao anexo
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile() file: Express.Multer.File) {}
}
