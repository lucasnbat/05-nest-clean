import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodObject } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  /*
   * Método padrão dos pipes é o transform(). Ele pega a operação e executa
   * alguma coisa, no caso, uma validação usando uma dependência schema do
   * tipo ZodObject para validar via parse() o body que está sendo interceptado
   * conforme as regras do schema recebido como dependência
   */
  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
