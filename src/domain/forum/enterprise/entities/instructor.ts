import { Entity } from '@/core/entities/entity'

type InstructorProps = {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: string) {
    return new Instructor(props, id)
  }
}
