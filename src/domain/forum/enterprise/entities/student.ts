import { Entity } from '@/core/entities/entity'

type StudentProps = {
  name: string
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: string) {
    return new Student(props, id)
  }
}
