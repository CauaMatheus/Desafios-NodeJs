<h1 align="center">Conceitos Node</h1>

## Sumário
- [💻 Sobre o desafio](#-sobre-o-desafio)
- [🔗 Rotas da aplicação](#-rotas-da-aplicação)
  - [POST `/users`](#post-users)
  - [POST `/todos`](#get-todos)
  - [PUT `/todos/:id`](#put-todosid)
  - [PATCH `/todos/:id/done`](#patch-todosiddone)
  - [DELETE `/todos/:id`](#delete-todosid)
- [🤔 Como foi feito os testes ?](#-como-foi-realizado-os-testes-)
- [📦 Como usar](#-como-usar)

## 💻 Sobre o desafio
Nesse desafio, eu deveria criar uma aplicação para treinar o que eu tinha até agora no Node.js!

Essa aplicação era um gerenciador de tarefas 
<br/>(em ingles ***Todos***).<br/>

### Especificações:
Será permitida a criação de um usuário com `name` e `username`, bem como fazer o CRUD de *todos*:

- Criar um novo *todo*;
- Listar todos os *todos*;
- Alterar o `title` e `deadline` de um *todo* existente;
- Marcar um *todo* como feito;
- Excluir um *todo*;

Tudo isso para cada usuário em específico (o `username` será passado pelo header). A seguir veremos com mais detalhes o que e como foi feito 🚀

## 🔗 Rotas da aplicação
### POST `/users`
A rota recebe dois argumentos dentro do `body`, `name` e `username`. <br/>
E a operação deve serguir como o seguinte objeto na criação do usuário:
```
{
  id: uuid(),
  name: "Cauã Matheus",
  username: "Farukkon",
  todos: []
}
```

### GET `/todos`
A rota deve receber, pelo `header` da requisição, o `username` e retornar uma lista com todos os ***todos*** desse usuário.

### POST `/todos`
A rota deve receber `title` e `deadline` pelo `body` da requisição, e também o `username` pelos `headers`.<br/>
A rota deve armazenar o todo criado dentro do `todos` do usuário.
```
{
  id: uuid(), // é obrigatório ser um uuid
  title: 'Nome da tarefa',
  done: false,
  deadline: new Date(deadline),
  created_at: new Date()'
}
```

### PUT `/todos/:id`
A rota deve receber o `title` e o `deadline` pelo `body` da requisição, e também o `username` pelos `headers`. <br/>
A rota poderá apenas alterar o `title` e o `deadline`, e apenas se o `id` dado for um `id` válido e presente em um dos `todos`

### PATCH `/todos/:id/done`
A rota deve receber o `username` pelos `headers`<br/>
Se o `id` inserido for correto, a rota deverá alterar o valor `done` do `todo` com o mesmo `id` para `true`.

### DELETE `todos/:id`
A rota deve receber o `username` pelos `headers` <br/>
Se o `id` inserido for correto, a rota deverá excluir o `todo` com o mesmo `id`

## 🤔 Como foi realizado os testes ?
- **Should be able to list all user's todos**

Para que esse teste passe, na rota GET `/todos` é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount` e então retornar a lista `todos` que está no objeto do usuário conforme foi criado para satisfazer o [primeiro teste](https://www.notion.so/Desafio-01-Conceitos-do-Node-js-59ccb235aecd43a6a06bf09a24e7ede8).

- **Should be able to create a new todo**

Para que esse teste passe, na rota POST `/todos` é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount`, pegar também o `title` e o `deadline` do corpo da requisição e adicionar um novo *todo* na lista `todos` que está no objeto do usuário.

Lembre-se de seguir a estrutura padrão de um *todo* como mostrado [aqui](https://www.notion.so/Desafio-01-Conceitos-do-Node-js-59ccb235aecd43a6a06bf09a24e7ede8). 

- **Should be able to update a todo**

Para que esse teste passe, na rota PUT `/todos/:id` é necessário atualizar um *todo* existente, recebendo o `title` e o `deadline` pelo corpo da requisição e o `id` presente nos parâmetros da rota.

- **Should not be able to update a non existing todo**

Para que esse teste passe, você não deve permitir a atualização de um *todo* que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato: 

```jsx
{
	error: 'Mensagem do erro'
}
```

- **Should be able to mark a todo as done**

Para que esse teste passe, na rota PATCH `/todos/:id/done` você deve mudar a propriedade `done`de um *todo* de `false` para `true`, recebendo o `id` presente nos parâmetros da rota.

- **Should not be able to mark a non existing todo as done**

Para que esse teste passe, você não deve permitir a mudança da propriedade `done` de um *todo* que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato: 

```jsx
{
	error: 'Mensagem do erro'
}
```

- **Should be able to delete a todo**

Para que esse teste passe, DELETE `/todos/:id` você deve permitir que um *todo* seja excluído usando o `id` passado na rota. O retorno deve ser apenas um status `204` que representa uma resposta sem conteúdo.

- **Should not be able to delete a non existing todo**

Para que esse teste passe, você não deve permitir excluir um *todo* que não exista e retornar uma resposta contendo um status `404` e um json no seguinte formato:

```jsx
{
	error: 'Mensagem do erro'
}
```

## 📦 Como usar
Primeiramente você deve baixar e entrar na pasta
```
  ❯ git clone https://github.com/CauaMatheus/Desafio-01-ConceitosNode.git
  ❯ cd Desafio-01-ConceitosNode
```
E agora para baixar as dependências e rodar o projeto basta seguir o exemplo de acordo com o seu package manager <br/>

```
**yarn**  
  ❯ yarn
  ❯ yarn dev
```
```
**npm**
  ❯ npm install
  ❯ npm dev
```
