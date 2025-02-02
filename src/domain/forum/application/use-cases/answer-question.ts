import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

type AnswerQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueIdEntity(authorId),
      questionId: new UniqueIdEntity(questionId),
    })
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueIdEntity(attachmentId),
        answerId: answer.id,
      })
    })
    answer.attachments = new AnswerAttachmentList(answerAttachments)
    await this.answersRepository.create(answer)
    return right({
      answer,
    })
  }
}
