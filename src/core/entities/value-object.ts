import { UniqueEntityID } from './unique-entity-id'

// essa é a classe "root" de value object
export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    // colocar apenas vo.props === this.props daria errado porque
    // o operador === compara a refernecia de memoria...e os objetos
    // vo e this estão em lugares de memoria difernetes
    // portanto, eu pego o valor, converto para JSON e depois comparo
    // apenas o valor com o === para ver se os TEXTOS e não a referencia
    // de memoria está igual
    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
