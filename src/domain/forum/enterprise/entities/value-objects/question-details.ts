import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export type QuestionDetailsProps = {
  questionId: UniqueIdEntity
  authorId: UniqueIdEntity
  author: string
  title: string
  content: string
  slug: Slug
  attachments: Attachment[]
  bestAnswerId?: UniqueIdEntity | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
