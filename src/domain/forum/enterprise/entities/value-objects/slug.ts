export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  // para criar um slug cru, tipo, se eu quiser usar num teste,
  // eu poder passar um "example-slug" sabendo que esse vai ser
  // o slug que vai ser retornado (get-question-by-slug.spec.ts por ex)
  static create(slug: string) {
    return new Slug(slug)
  }

  // métodos estáticos são aqueles que geralmente são funções utilitárias que po-
  // dem ser chamados a partir da classe diretamente. Ou seja, você não precisa
  // instanciar um objeto (= new Slug(value)) para usar essa função. Além disso,
  // ela não consegue acessar nada de nenhum objeto instanciado...ou seja, ela
  // é total separada dos objetos instanciados da classe. Geralmente as funções
  // estáticas não precisam de muito contexto e valores, então podem ser usadas
  // dessa forma, sem receber atributos ou valores de outros objetos instanciados.

  /**
   * Receiver a string and normalize it as a slug.
   *
   * Example: "An example title" --> "an-example-title"
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD') // transforma para formato sem caracter especial
      .toLowerCase() // transforma para minusculas
      .trim() // retira espaços
      .replace(/\s+/g, '-') // substitui qualquer espaço em branco por - (hífen)
      .replace(/[^\w-]+/g, '') // pega tudo que não é palavra (^\w) e substitui por string vazia
      .replace(/_/g, '') // substitui underlines(_) por strings vazias
      .replace(/--+/g, '') // substitui qualquer - duplicado por um - só
      .replace(/-$/g, '') // $ simboliza final da string...se tiver - antes do final, tira

    return new Slug(slugText) // aparentemente dá para retornar objetos instanciados de uma static
  }
}
