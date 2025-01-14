// Implementação do que você faria para seguir a risca o principio
// da Clean Arch de que não pode ter o @Injectable() dentro do caso
// de uso (CreateQuestionUseCase). Você precisaria criar um desses
// para cada controller da aplicação

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { Injectable } from '@nestjs/common'

@Injectable()
// extendi o caso de uso, peguei o mesmo QuestionsRepository que ele
// usa e chamei com o super() invocando o construtor da classe
// CreateQuestionUseCase do dominio
export class NestCreateQuestionUseCase extends CreateQuestionUseCase {
  constructor(questionsRepository: QuestionsRepository) {
    super(questionsRepository)
  }
}
