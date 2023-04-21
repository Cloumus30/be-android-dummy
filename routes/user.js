const express = require('express');
const { listUser, register, login, detailUser } = require('../controller/userController');
const auth = require('../middleware/authJwt');
const Route = express.Router()

Route.post('/register', register);
Route.post('/login', login);

Route.use(auth);
Route.get('/', listUser);
Route.get('/:id', detailUser);

module.exports = Route;