import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {
  // importante lembrar que `props: StudentProps` refere-se a um objeto que será
  // passado para o construtor contendo os atributos do objeto a instanciar (no
  // caso, o atrib. name)

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id)
    return student
  }
}
