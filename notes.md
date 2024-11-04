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