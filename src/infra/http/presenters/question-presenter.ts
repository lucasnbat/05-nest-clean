import { Question } from '@/domain/forum/enterprise/entities/question'

// A função do Presenter é simplesmente formatar para um formato desejado...
// Nesse caso, as questions vindas de FetchRecentQuestionsUseCase vem no
// formato que o método findManyRecent() (acho que é esse o nome) cospe...
// Ou seja, totalmente um emaranhado JSON. Aqui estamos formatando para um
// formato mais simples de consumir no front-end

// Em outro lugar da app você pode estar querendo que retorne apenas titulo
// e content...só fazer outro
export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
