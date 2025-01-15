// Arquivo meta data que vai adicionar dados na requisição para que
// o AuthGuard do nestjs/passport veja o "isPublic" e consiga liberar
// algumas rotas

// Feito isso, é só ir em cima do Controller com a rota (ex: /sessions)
// e colocar o decorator @Public() embaixo
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
