import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

class Student extends Entity<StudentProps> {
  // importante lembrar que `props: StudentProps` refere-se a um objeto que será
  // passado para o construtor contendo os atributos do objeto a instanciar (no
  // caso, o atrib. name)

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id)
    return student
  }
}
