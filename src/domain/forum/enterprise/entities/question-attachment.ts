import { Entity } from '@/core/entities/entity'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'

export type QuestionAttachmentProps = {
  questionId: UniqueIdEntity
  attachmentId: UniqueIdEntity
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id?: string) {
    const questionAttachment = new QuestionAttachment(props, id)
    return questionAttachment
  }
}
