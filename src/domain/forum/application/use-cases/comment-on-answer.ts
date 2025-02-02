import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

type CommentOnAnswerUseCaseRequest = {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    const answerComment = AnswerComment.create({
      authorId: new UniqueIdEntity(authorId),
      answerId: new UniqueIdEntity(answerId),
      content,
    })
    await this.answerCommentsRepository.create(answerComment)
    return right({
      answerComment,
    })
  }
}
