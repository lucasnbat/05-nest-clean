import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from './question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    // se pergunte: que info. posso usar para dizer que um attachment é igual a outro?
    return a.attachmentId.equals(b.attachmentId)
  }
}
