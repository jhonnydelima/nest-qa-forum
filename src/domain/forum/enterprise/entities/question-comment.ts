import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export type QuestionCommentProps = {
  questionId: UniqueIdEntity
} & CommentProps

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: string,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return questionComment
  }
}
