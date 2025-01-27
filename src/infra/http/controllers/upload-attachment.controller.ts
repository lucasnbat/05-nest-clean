import { Controller, Param, Post } from '@nestjs/common'

@Controller('/attachments')
export class GetQuestionBySlugController {
  //   constructor() {}

  @Post()
  async handle(@Param('slug') slug: string) {}
}
