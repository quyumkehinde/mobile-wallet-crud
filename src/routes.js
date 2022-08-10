import { login, register } from './controllers/AuthController.js';
import { home, notFound } from './controllers/BaseController.js';
import { depositFund, transferFund, withdrawFund } from './controllers/TransactionController.js';
import express from 'express';

export const routes = express.Router()
    .get('/', home)
    .post('/register', register);
