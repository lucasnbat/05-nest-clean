# Nest.js

- Crie um projeto: 
  ```vim
  nest new nome-projeto
  ```
- Faça limpeza:
  - Elimine o readme padrão, os arquivos da pasta `test`, o `.spec.ts` da pasta
    `src`, os arquivos de prettier e eslint, bem como o arquivo da pasta `jest`.
  - Vá no `package.json` e elimine dependências de supertest, jest, eslint e
    prettier;
  - execute `npm i` para limpar as dependências;

# Fundamentos de Nest.js

## Conceitos

- Temos três tipos de componentes principais:
  - **modules**:
    - Geralmente uma classe com o decorator `@Module`;
    - Ele une os controllers, services, conexões com BD relacionados a um bloco
      do sistema;
    - controllers, recebe controllers...;
    - providers: todas as dependências que os controllers podem ter (ex: AppService);
      - Se não tiver AppService, dá ruim;
      - Para que a dep. seja injetável, precisa estar com o decorator `@Injectable`
    - *tudo que não recebe req. http é um provider. se recebe req. http, é controller*
  - **controllers**
    - portas de entrada para a aplicação, geralmente por rotas web de api
    - usam fortemente decorators no nest.js
      - **decorators** são funções que adicionam comportamentos a objetos no sistema,
        como classes, outras funções, objetos, etc... Eles recebem o objeto a-
        baixo deles como parâmetro e retornam esse objeto modificado;
  - **services**

## Eslint e prettier

- `npm i eslint @rocketseat/eslint-config -D`
- crie um `.eslintrc.json` com regra para não alertar sobre constructors vazios:
  ```vim
  {
    "extends": "@rocketseat/eslint-config/node",
    "rules": {
        "no-useless-constructor":"off"
    }
  }
  ```
 - No `.eslintignore`:
   ```vim
   node_modules
   dist
   ```

## Configurando prisma

- `npm i prisma -D`
- `npm i @prisma/client`
- `npx prisma init`

## Criando primeiras rotas

- Altere esses parâmetors no `tsconfig.json`:
  ```vim
    "strict": true,
    "strictNullChecks": true,
  ```
## Pipes no Nest.js

- São middlewares. A ideia é interceptar e realizar operações antes de continuar
  o processamento.
- Níveis de uso do zod:
  - Zod (`npm install zod`)
  - Usar zod-validation-error lib para melhorar legibilidade dos erros 
    (`npm install zod-validation-error`)

## Como validar variáveis ambiente no Nest.js

- `npm install @nestjs/config`
- configure um `env.ts` na raiz:
  ```vim
    import { z } from 'zod'

    export const envSchema = z.object({
      DATABASE_URL: z.string().url(),
      PORT: z.coerce.number().optional().default(3333),
    })

    export type EnvType = z.infer<typeof envSchema>
  ```
- Depois inserimos o `ConfigModule` na chave `imports`:
  ```vim
  @Module({
    imports: [
      ConfigModule.forRoot({
        validate: (env) => envSchema.parse(env),
        isGlobal: true,
      }),
    ],
    controllers: [CreateAccountController],
    providers: [PrismaService],
  })
  export class AppModule {}
  ```
- Note:
  - No nest.js não precisamos ter apenas um único arquivo `.module.ts`.
  - Podemos ter vários módulos e depois importar em um só. Para isso usamos
    `imports: []`;
  - Quando vamos passar configurações para um módulo, devemos usar a função
    `forRoot()` e inserir uma outra função dentro com os critérios e regras
    de validação. (acredito que podemos passar propriedades também, além 
    de funções).
  - o `isGlobal: true` permite que seja um módulo que funciona globalmente.
    assim você não precisará importar ele em cada módulo que tiver na aplicação;
- Adicione e use o `configService` no `main.ts`:
  
  ```vim
  import { NestFactory } from '@nestjs/core'
  import { AppModule } from './app.module'
  import { ConfigService } from '@nestjs/config'

  async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      logger: false, // tirar logs ao iniciar servidor
    })

    // app.get pega algum serviço (config module é um serviço do ConfigModule
    // que está no app.module.ts)
    // aparentemente é um plugin automático disponibilizado ao importar o módulo
    // ConfigModule.forRoot()
    const configService = app.get(ConfigService)

    // usa o plugin para pegar a var. ambiente PORT
    const port = configService.get('PORT')

    await app.listen(port)
  }
  bootstrap()
  ```

  ## Trabalhando com autenticação no Nest.js

- Criar um arquivo `src/auth/auth.module.ts`. Módulos sempre precisam do 
  decorator `@Module`:
  ```vim
  import { Module } from '@nestjs/common'

  @Module({})
  export class AuthModule {}
  ```
- Instalar: 
  ```bash
  npm install @nestjs/passport @nestjs/jwt
  ```

- Melhor algoritmo : RS256
  - Ele não usa apenas uma chave secreta (secret do jwt HS256)
  - Ele usa duas:
    - Privada: usada para gerar novos tokens, mantida em segredo;
    - Pública: gerada pela chave privada, usada para decodificar e checar os
      tokens recebidos;
        - Pode vazar, pois o poder dela é apenas para decofidicação, não para
          gerar novos tokens.

## Algumas anotações

- Note o `auth.module.ts` para verificar como funciona a autenticação no nest;
- É preciso criar um `jwt.strategy.ts` pois há varias estratégias de autenticação
  que a biblioteca Passport utiliza, e uma delas é a JWT;

## Configurando o `jwt.strategy.ts`

- Instale:
  ```vim
  npm install passport-jwt 
  npm install @types/passport-jwt -D
  ```
  (essa é a strategy que vamos usar)
- crie o arquivo `auth/jwt.strategy.ts` 

## SWC

- Plataforma em rust usada para compilar TS em JS;
- É parecida com o esbuild usado por ferramentas como vitest, ts-node(acho) e etc;
- Instalação do vitest com a engine typescript desejada:
  ```bash
  npm i vitest unplugin-swc @swc/core @vitest/coverage-v8 -D
  ```
- crie o `vitest.config.ts` e insira:
  ```vim
    import swc from 'unplugin-swc'
    import { defineConfig } from 'vitest/config'

    export default defineConfig({
      test: {
        globals: true,
        root: './',
      },
      plugins: [
        swc.vite({
          module: { type: 'es6' },
        }),
      ], 
    })
  ```
- depois: `npm install vite-tsconfig-paths -D` (serve para usar o caminho confi-
  gurado dentro do `tsconfig.json` dentro do `vitest.config.ts`)