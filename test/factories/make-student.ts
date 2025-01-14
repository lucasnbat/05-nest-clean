import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { faker } from '@faker-js/faker' // assim que tem que ser importado

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID, // (opcional) pode passar um id manual
) {
  const student = Student.create(
    {
      email: faker.person.fullName(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}
