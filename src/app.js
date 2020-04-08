const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

//arry de repositórios
const repositories = [];

//Listando os repositórios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//Criando um repositório
app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository);

  return response.json(repository);

});

//alterando um repositório com base no uuid
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found"});
  } 

  const repository = repositories.find( repository => repository.id === id);

  repositories[repositoryIndex] = {...repository, title: title, url: url, techs: techs};

  return response.json(repositories[repositoryIndex]);


});

//deletando repositório
app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found"});
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

//Adicionando like
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found"});
  }
  const repository = repositories.find( repository => repository.id === id);

  repositories[repositoryIndex] = {...repository, likes: repository.likes + 1 };

  return response.json(repositories[repositoryIndex]);
  
});

module.exports = app;
