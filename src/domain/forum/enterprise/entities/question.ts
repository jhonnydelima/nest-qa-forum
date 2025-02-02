import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { BestAnswerChosenEvent } from '../events/best-answer-chosen-event'

export type QuestionProps = {
  authorId: UniqueIdEntity
  bestAnswerId?: UniqueIdEntity
  title: string
  slug: Slug
  content: string
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set bestAnswerId(value: UniqueIdEntity | undefined) {
    if (value === undefined) {
      return
    }
    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(value)
    ) {
      this.addDomainEvent(new BestAnswerChosenEvent(this, value))
    }
    this.props.bestAnswerId = value
    this.touch()
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.touch()
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: string,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return question
  }
}
