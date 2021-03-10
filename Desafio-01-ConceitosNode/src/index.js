const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  request.user = user;
  user ? next() : response.status(400).json({ error: "User Not Found" });
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const userAlreadyExists = users.some(user => user.username === username)
  if (userAlreadyExists) response.status(400).json({ error: "User already exists" })
  const userOperation = {
    id: uuid(),
    name,
    username,
    todos: []
  }
  users.push(userOperation);
  return response.status(201).json(userOperation);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const deadLineDate = new Date(deadline)
  const { user } = request;
  const todoOperation = {
    id: uuid(),
    title,
    done: false,
    deadline: deadLineDate,
    created_at: new Date()
  }
  user.todos.push(todoOperation);

  return response.status(201).json(todoOperation);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;
  const todo = user.todos.find(todo => todo.id === id);

  if (todo) {
    todo.title = title
    todo.deadline = deadline
    return response.json(todo);
  } else {
    return response.status(404).json({ error: 'Todo not found' })
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find(todo => todo.id === id);

  if (todo) {
    todo.done = true;
    return response.json(todo);
  } else {
    return response.status(404).json({ error: "Todo not found" })
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find(todo => todo.id === id);

  if (todo) {
    user.todos.splice(user.todos.indexOf(todo), 1);
    return response.status(204).json(user.todos)
  } else {
    return response.status(404).json({ error: "Todo not found" })
  }

});

module.exports = app;