// isso é um gateway (conceito desempenhado, por ex., pelos repositórios
// prisma que são chamados nos casos de uso) para geração de senha. Ele
// provavelmente (se eu não me enganar) será chamado pelo caso de uso de
// autenticação, por ex, para gerar o hash de senha do usuário;

// Já faremos ele como abstract por causa da limitação do nestjs sobre
// injeção de dep. que encontramos no QuestionsRepository

// Aqui temos apenas a parte de CONTRATO/tipagem do gateway

export abstract class Encrypter {
  // payload é o conteudo que vai junto para cifrar...
  // quase sempre é {sub: ajdf-ajfs-alfd-sdfd}
  // portanto a tipagem diz que pode receber um objeto
  // (record) que vai ter chave sendo string e um valor
  // desconhecido. A resposta é um token (string)
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
