import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    // se pergunte: que info. posso usar para dizer que um attachment é igual a outro?
    return a.attachmentId.equals(b.attachmentId)
  }
}
