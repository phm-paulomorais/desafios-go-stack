const express = require('express');

const server = express();

server.use(express.json());

/**
 * Utilizamos a variável `numberOfRequests` como
 * `let` porque vai sofrer mutação. A variável
 * `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo
 * uma constante.
 */
var contador = 0;
const projects = [];

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  contador++;
  console.log(`Quantidade de acesso(s): ${contador}`)
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
}
server.use(logRequests);

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next){
  const { id } = req.params
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json( {error: 'Project not find' });
  }

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title }  = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists,  (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});
 
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params; 
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
