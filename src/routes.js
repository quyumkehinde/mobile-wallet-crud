import { login, register } from './controllers/AuthController.js';
import { home } from './controllers/BaseController.js';
import { depositFund, transferFund, withdrawFund } from './controllers/TransactionController.js';
import { Router } from 'express';
import { Authenticate } from './middlewares/Authenticate.js';

const routes = Router();
routes
    .get('/', home)
    .post('/register', register)
    .post('/login', login);

routes.use('/wallet', Authenticate, Router()
    .post('/deposit', depositFund)
    .post('/withdraw', withdrawFund)
    .post('/transfer', transferFund)
);

export default routes;
