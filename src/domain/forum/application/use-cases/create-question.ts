import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { UniqueIdEntity } from '@/core/entities/unique-id-entity'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

type CreateQuestionUseCaseRequest = {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueIdEntity(authorId),
      title,
      content,
    })
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueIdEntity(attachmentId),
        questionId: question.id,
      })
    })
    question.attachments = new QuestionAttachmentList(questionAttachments)
    await this.questionsRepository.create(question)
    return right({
      question,
    })
  }
}
