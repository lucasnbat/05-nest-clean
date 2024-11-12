import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayloadType } from './jwt.strategy'

/*
 * Criando decorator do tipo param, ele não será para uma classe, e sim que ser-
 * virá de parâmetro para uma função (usaremos em async handle(@CurrentUser()))
 */
export const CurrentUser = createParamDecorator(
  /*
   * Primeiro parametro são os parametros que eu passo para decorator, como o
   * "/acesso" em @Get("/acesso"). Não usaremos isso
   * Context pega o contexto da requisição, podendo buscar métodos, info. etc da
   * requisição.
   */
  (_: never, context: ExecutionContext) => {
    // aqui você tem um outro jeito de capturar a requisição
    const request = context.switchToHttp().getRequest()

    /* e depois retornar o .user que existe na requisição. Essa informação existe
     * devido às configurações de autenticação que temos na aplicação.
     * QUe configurações? Nosso auth.module.ts junto ao sub que inserimos no
     * authenticate-controller.controller.ts
     */
    return request.user as UserPayloadType
  },
)
