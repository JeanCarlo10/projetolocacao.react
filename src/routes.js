const express = require('express');
const routes = express.Router();
const User = require('./controllers/UsersController');
const Client = require('./controllers/ClientsController');
const Material = require('./controllers/MaterialsController');
const Rent = require('./controllers/RentsController');

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
routes.get('/api/clients/index', Client.index);
routes.get('/api/clients.details/:_id', Client.details);
routes.delete('/api/clients/:_id', Client.delete);
routes.put('/api/clients', Client.update);
routes.post('/api/clients/upload-avatar', Client.uploadAvatar);
routes.get('/api/clients/thumbnail-avatar/:_id', Client.thumbnailAvatar);

//Rotas de Materiais
routes.post('/api/materials', Material.create);
routes.get('/api/materials/index', Material.index);
routes.get('/api/materials.details/:_id', Material.details);
routes.delete('/api/materials/:_id', Material.delete);
routes.put('/api/materials', Material.update);
routes.get('/api/materials', Material.detailsInProducts);

//Rotas de Pedidos
routes.post('/api/rents', Rent.create);
routes.get('/api/rents/index', Rent.index);
routes.get('/api/rents/search', Rent.search);
routes.get('/api/rents.details/:_id', Rent.details);
routes.delete('/api/rents/:_id', Rent.delete);
routes.put('/api/rents', Rent.update);
routes.get('/api/rents/status', Rent.status);
routes.post('/api/rents/change-status', Rent.changeStatus);

module.exports = routes;