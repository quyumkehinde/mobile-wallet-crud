import { login, register } from './controllers/AuthController.js';
import { home, notFound } from './controllers/BaseController.js';
import { depositFund, transferFund, withdrawFund } from './controllers/TransactionController.js';
import { Router } from 'express';

const routes = Router();
routes.get('/api/v1', home);
routes.post('/register', register);

export default routes;
