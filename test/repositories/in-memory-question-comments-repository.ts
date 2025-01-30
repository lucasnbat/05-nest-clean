import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  // nos casos aqui onde você precisaria invocar o studentsRepository dentro
  // do método de retorno de commentsWithAuthor, não faz sentido você usar o
  // contrato geral e oficial do programa (StudentsRepository) e inserir la um
  // método de busca por id de usuário... porque seria uma busca de id só para
  // esse método. Compensa mais você tipar a dependência com o repositório
  // InMemoryStudentsRepository, que segue o Students Repository
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        // vai la no repositorio de estudantes e pega as info. do estudante
        // que é author desse comentário
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        // se não existe, erro..
        if (!author) {
          throw new Error(
            `Author with ID ${comment.authorId.toString()} does not exist`,
          )
        }

        // se existe, retorna um CommentWithAuthor
        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return questionComments
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
