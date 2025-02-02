import { Entity } from '@/core/entities/entity'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'

export type AnswerAttachmentProps = {
  answerId: UniqueIdEntity
  attachmentId: UniqueIdEntity
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: string) {
    const answerAttachment = new AnswerAttachment(props, id)
    return answerAttachment
  }
}
