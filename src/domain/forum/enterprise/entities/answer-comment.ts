import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export type AnswerCommentProps = {
  answerId: UniqueIdEntity
} & CommentProps

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: string) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return answerComment
  }
}
