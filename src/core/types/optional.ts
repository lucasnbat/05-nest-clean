// isso permite você passar um tipo e depois informar qual das chaves do
// objeto de tipagem você quer que virem opcionais

// O que é Optional?
// Ele recebe dois parâmetros genéricos:
// T: O tipo base que você está trabalhando (por exemplo, Post).
// K: As chaves do tipo T que você quer tornar opcionais.

// 1. Pick<Partial<T>, K>
// Partial<T> transforma todas as propriedades do tipo T em opcionais.
// Pick<...> seleciona apenas as propriedades de T que estão no conjunto K (as que você quer tornar opcionais).

// 2. Omit<T, K>:
// Remove do tipo T as propriedades especificadas em K (as que você marcou como opcionais).

// 3. Pick<Partial<T>, K> & Omit<T, K>:
// Combina o resultado:
// As propriedades em K agora são opcionais.
// As demais propriedades de T permanecem como estavam (obrigatórias).

// ou seja, Pick<Partial<T>, K> está tornando todas as props do objeto opcionais e selecionando as K
// propriedades que você quer que sejam opcionais

// Omit<T, K> pega o seu objeto inicial e retira dele as props K que você selecionou para serem
// opcionais. O que restar em T permanece como opcional

/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
