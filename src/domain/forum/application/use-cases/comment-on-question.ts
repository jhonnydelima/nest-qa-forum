import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

type CommentOnQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    const questionComment = QuestionComment.create({
      authorId: new UniqueIdEntity(authorId),
      questionId: new UniqueIdEntity(questionId),
      content,
    })
    await this.questionCommentsRepository.create(questionComment)
    return right({
      questionComment,
    })
  }
}
