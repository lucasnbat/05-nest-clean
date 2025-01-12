// obs: "instancia" pode ser qq coisa, um number, uma string...
// logo, um vetor de instancia pode ser um vetor de number (Number[]) ou
// vetor de strings... (String[])
export abstract class WatchedList<T> {
  public currentItems: T[]
  private initial: T[]
  private new: T[]
  private removed: T[]

  // inicia com o valor de vetor recebido
  // veja que new e removed são vazios, pois nada foi adicionado ou removido ainda
  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || []
    this.initial = initialItems || []
    this.new = []
    this.removed = []
  }

  // método abstrato de comparação entre instancias a e b
  // pode ter criterios definidos porquem usar a classe
  // por exemplo, pode acabar virando um método de comparação de igualdade de numeros
  // ou seja, o critério de comparação será definido no uso da classe ao codar
  abstract compareItems(a: T, b: T): boolean

  // gets
  public getItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.new
  }

  public getRemovedItems(): T[] {
    return this.removed
  }

  // verifica se o item passado é o item atual na lista de currentItems
  // método filtra com base no criterio de compareItems...se algum elemento
  // é pego na filtragem, o array retornado por filter é diferente de 0,
  // acusando que um item que bate com o criterio de compareItems foi encontrado
  // e que, no caso, é o item atual
  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    )
  }

  // lógica análoga à do isCurrentItem
  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  // lógica análoga à do isCurrentItem
  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // método que cria um novo array de tudo que não for igual ao item passado
  // usando o filter, ou seja, no final só sobra o que é diferente do que você
  // quer eliminar
  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  // lógica análoga ao removeFromNew
  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  // lógica análoga ao removeFromNew
  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  // verifica se o item passado ao método é um dos items que foram inicialmente
  // passados no vetor de valores iniciais
  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // verifica se o item existe, ou seja, se é item corrente, atual, na lista
  // de itens
  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  public add(item: T): void {
    // verifica se está na lista de itens removidos, se sim, remove de lá
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item)
    }

    // se não está na lista de itens novos e não foi adicionado inicialmente,
    // adiciona na lista de itens novos
    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item)
    }

    // se não está na lsita de itens correntes/atuais, adiciona lá
    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T): void {
    // remove dos itens atuais
    this.removeFromCurrent(item)

    // remove dos itens novos
    if (this.isNewItem(item)) {
      this.removeFromNew(item)

      return
    }

    // se ainda não está na lista de removidos, adiciona ele lá
    if (!this.isRemovedItem(item)) {
      this.removed.push(item)
    }
  }

  public update(items: T[]): void {
    // pega apenas itens de "items" que não estão na lista currentItems
    // veja que ele pega a lista currentItems usando getItems()
    // depois verifica se some(), se existe algum item "b" qualquer igual ao
    // item "a" da lista items
    // se sim, pega todos os iguais, todos os que existem em items e currentItems
    // negação: agora inverte e pega todos os itens que EXISTEM em items mas
    // AINDA NÃO EXISTEM em currentItems. São esses que AINDA NÃO EXISTEM que
    // queremos adicionar, ou seja, que serão os newItems
    // currentItems: [1,2] items: [1,3,4]; array retorno: [3,4]
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })

    // a lista "items" enviada nesse método é feita para sobrescrever a lista
    // currentItems. Aqui, pegamos a currentItems e verificamos, para cada item
    // dela, se ele já está presente na lista items. Então, pegamos apenas os que
    // estão em currentItems e não estão em items, ou seja, os que serão eliminados.
    // currentItems: [1,2] items: [1,3,4]; array retorno: [2]
    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    // currentItems será sobrescrito com items, no seco
    this.currentItems = items
    // new receberá os novos itens, aqueles que estão em items mas não estavam
    // em currentItems
    this.new = newItems
    // removed receberá os itens removidos, aqueles que estavam em currentItems
    // mas não estavam em items e foram eliminados
    this.removed = removedItems
  }
}
