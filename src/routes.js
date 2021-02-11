const express = require('express');
const routes = express.Router();
const User = require('./controllers/UsersController');
const Client = require('./controllers/ClientsController');
const Material = require('./controllers/MaterialsController');

routes.get('/', User.index);

//Rotas de Usuários
routes.post('/api/users', User.create);
routes.get('/api/users', User.index);
routes.get('/api/users.details/:_id', User.details);
routes.delete('/api/users/:_id', User.delete);
routes.put('/api/users', User.update);
routes.post('/api/users/login', User.login);
routes.get('/api/users/checktoken', User.checkToken);
routes.get('/api/users/destroytoken', User.destroyToken);

//Rotas de Clientes
routes.post('/api/clients', Client.create);
routes.get('/api/clients', Client.index);
routes.get('/api/clients.details/:_id', Client.details);
routes.delete('/api/clients/:_id', Client.delete);
routes.put('/api/clients', Client.update);

//Rotas de Materiais
routes.post('/api/materials', Material.create);
routes.get('/api/materials', Material.index);
routes.get('/api/materials.details/:_id', Material.details);
routes.delete('/api/materials/:_id', Material.delete);
routes.put('/api/materials', Material.update);

module.exports = routes;