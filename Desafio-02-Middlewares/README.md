<h1 align="center">Middlewares</h1>

## Sumário
- [💻 Sobre o desafio]()
- [🔗 Middlewares da aplicação]()
  - [`checksExistsUserAccount`](#checksexistsuseraccount)
  - [`checksCreateTodosUserAvailability`](#checkscreatetodosuseravailability)
  - [`checksTodoExists`](#checkstodoexists)
  - [`findUserById`](#finduserbyid)
- [🤔 Como foi feito os testes ?](#-como-foi-realizado-os-testes-)
- [📦 Como usar](#-como-usar)

## 💻 Sobre o desafio
Nesse desafio tive que trabalhar mais a fundo com middlewares no Express. Dessa forma,eu fixei ainda mais os conhecimentos obtidos até agora. 

Para facilitar um pouco mais do conhecimento da regra de negócio, eu trabalhei com a mesma aplicação do desafio anterior: uma aplicação para gerenciar tarefas (ou ***todos***) mas com algumas mudanças.

Será permitida a criação de um usuário com `name` e `username`, bem como fazer o CRUD de *todos*:

- Criar um novo ***todo***;
- Listar todos os ***todos***;
- Alterar o `title` e `deadline` de um *todo* existente;
- Marcar um ***todo*** como feito;
- Excluir um ***todo***;

Tudo isso para cada usuário em específico. Além disso, dessa vez teremos um plano grátis onde o usuário só pode criar até dez ***todos*** e um plano Pro que irá permitir criar ***todos*** ilimitados, isso tudo usando middlewares para fazer as validações necessárias.

A seguir veremos com mais detalhes o que e como foi feito 🚀

## 🔗 Middlewares da aplicação
### `checksExistsUserAccount`
Esse middleware é responsável por receber o username do usuário pelo header e validar se existe ou não um usuário com o username passado. Caso exista, o usuário deve ser repassado para o request e a função next deve ser chamada.
```
** Meu código**
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (user) {
    request.user = user
    return next()
  } else {
    return response.status(404).json({ error: 'User not found' })
  }
}
```

### `checksCreateTodosUserAvailability`
Esse middleware deve receber o **usuário** já dentro do request e chamar a função next apenas se esse usuário ainda estiver no **plano grátis e ainda não possuir 10 *todos* cadastrados** ou se ele **já estiver com o plano Pro ativado**. 
```
** Meu código**
function checksCreateTodosUserAvailability(request, response, next) {
  const { user } = request;
  if ((user.todos.length < 10) || user.pro) {
    return next()
  } else {
    return response.status(403).json({ error: "User already have 10 todos and does not have pro plan" });
  }
}
```

### `checksTodoExists`
Esse middleware deve receber o **username** de dentro do header e o **id** de um *todo* de dentro de `request.params`. Você deve validar o usuário, validar que o `id` seja um uuid e também validar que esse `id` pertence a um *todo* do usuário informado.

Com todas as validações passando, o *todo* encontrado deve ser passado para o `request` assim como o usuário encontrado também e a função next deve ser chamada.

```
** Meu código**
function checksTodoExists(request, response, next) {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  if (!validate(id)) {
    return response.status(400).json({ error: 'The ID has to be UUID' });
  }
  if (!user) {
    return response.status(404).json({ error: 'User does not exist' });
  }

  const todo = user.todos.find(todo => todo.id === id)
  if (todo) {
    request.todo = todo;
    request.user = user;
    return next()
  } else {
    return response.status(404).json({ error: 'Todo not found' })
  }
}
```

### `findUserById`

Esse middleware possui um funcionamento semelhante ao middleware `checksExistsUserAccount` mas a busca pelo usuário deve ser feita através do **id** de um usuário passado por parâmetro na rota. Caso o usuário tenha sido encontrado, o mesmo deve ser repassado para dentro do `request.user` e a função next deve ser chamada.

```
** Meu código**
function findUserById(request, response, next) {
  const { id } = request.params;
  const user = users.find(user => user.id === id)

  if (user) {
    request.user = user
    return next()
  } else {
    return response.status(404).json({ error: 'User not found' })
  }
}
```

## 🤔 Como foi realizado os testes ?
### Testes dos middlewares

- **Should be able to find user by username in header and pass it to request.user**

    Para que esse teste passe, você deve permitir que o middleware **checksExistsUserAccount** receba um username pelo header do request e caso um usuário com o mesmo username exista, ele deve ser colocado dentro de `request.user` e, ao final, retorne a chamada da função `next`.

    Atente-se bem para o nome da propriedade que armazenará o objeto `user` no request.

- **Should not be able to find a non existing user by username in header**

    Para que esse teste passe, no middleware **checksExistsUserAccount** você deve retornar uma resposta com status `404` caso o username passado pelo header da requisição não pertença a nenhum usuário. Você pode também retornar uma mensagem de erro mas isso é opcional.

- **Should be able to let user create a new todo when is in free plan and have less than ten todos**

    Para que esse teste passe, você deve permitir que o middleware **checksCreateTodosUserAvailability** receba o objeto `user` (considere sempre que o objeto existe) da `request` e chame a função `next` somente no caso do usuário estar no **plano grátis e ainda não possuir 10 *todos* cadastrados** ou se ele **já estiver com o plano Pro ativado**.

    Você pode verificar se o usuário possui um plano Pro ou não a partir da propriedade `user.pro`. Caso seja `true` significa que o plano Pro está em uso.

- **Should not be able to let user create a new todo when is not Pro and already have ten todos**

    Para que esse teste passe, no middleware **checksCreateTodosUserAvailability** você deve retornar uma resposta com status `403` caso o usuário recebido pela requisição esteja no **plano grátis** e **já tenha 10 *todos* cadastrados**. Você pode também retornar uma mensagem de erro mas isso é opcional.

- **Should be able to let user create infinite new todos when is in Pro plan**

    Para que esse teste passe, você deve permitir que o middleware **checksCreateTodosUserAvailability** receba o objeto `user` (considere sempre que o objeto existe) da `request` e chame a função `next` caso o usuário já esteja com o plano Pro. 

    Se você satisfez os dois testes anteriores antes desse, ele já deve passar também.

- **Should be able to put user and todo in request when both exits**

    Para que esse teste passe, o middleware **checksTodoExists** deve receber o `username` de dentro do header e o `id` de um *todo* de dentro de `request.params`. Você deve validar que o usuário exista, validar que o `id` seja um uuid e também validar que esse `id` pertence a um *todo* do usuário informado.

    Com todas as validações passando, o *todo* encontrado deve ser passado para o `request` assim como o usuário encontrado também e a função next deve ser chamada.

    É importante que você coloque dentro de `request.user` o usuário encontrado e dentro de `request.todo` o *todo* encontrado.

- **Should not be able to put user and todo in request when user does not exists**

    Para que esse teste passe, no middleware **checksTodoExists** você deve retornar uma resposta com status `404` caso não exista um usuário com o `username` passado pelo header da requisição.

- **Should not be able to put user and todo in request when todo id is not uuid**

    Para que esse teste passe, no middleware **checksTodoExists** você deve retornar uma resposta com status `400` caso o `id` do *todo* passado pelos parâmetros da requisição não seja um UUID válido (por exemplo `1234abcd`).

- **Should not be able to put user and todo in request when todo does not exists**

    Para que esse teste passe, no middleware **checksTodoExists** você deve retornar uma resposta com status `404` caso o `id` do *todo* passado pelos parâmetros da requisição não pertença a nenhum *todo* do usuário encontrado.

- **Should be able to find user by id route param and pass it to request.user**

    Para que esse teste passe, o middleware **findUserById** deve receber o `id` de um usuário de dentro do `request.params`. Você deve validar que o usuário exista, repassar ele para `request.user` e retornar a chamada da função next.

- **Should not be able to pass user to request.user when it does not exists**

    Para que esse teste passe, no middleware **findUserById** você deve retornar uma resposta com status `404` caso o `id` do usuário **passado pelos parâmetros da requisição não pertença a nenhum usuário cadastrado.

## 📦 Como usar
Primeiramente você deve baixar e entrar na pasta
```
  ❯ git clone https://github.com/CauaMatheus/Desafio-02-Middlewares.git
  ❯ cd Desafio-02-Middlewares
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
