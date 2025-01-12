import { UniqueEntityID } from './unique-entity-id'

// o generic Props foi usado no lugar dos anys para permitir que eu pudesse
// fazer algo como get content() {this.props.content} na classe answer por ex;
// sem o generic, com o any, ele não mostra as opções de tipo possiveis (ctrl + espaço)
// dentro de cada classe, então, eu passo <AnswerProps> no lugar de <Props>, per-
// mitindo eu ter a intelissense do typescript
export abstract class Entity<Props> {
  // privado pois não deve ser acessível a mudanças feitas por outras classes
  private _id: UniqueEntityID
  // atributo generico para referenciar os atributos das classes
  protected props: Props

  // o que faço é dar um método que DISPONIBILIZE a leitura do id
  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    // instancia um UniqueEntityID passando o id recebido no construtor e
    // inserindo no atributo _id
    // caso não seja passado, a lógica interna do UniqueEntityID vai gerar
    // um id automático (hoje, por meio do randomUUID())
    this._id = id ?? new UniqueEntityID()
  }

  // retorna se a entidade recebida na função é a entidade atual
  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }
  }
}
