import http, {serverResponse} from 'http';
import * as BaseController from '../../src/controllers/BaseController.js';
import { createTransaction } from '../../src/repositories/TransactionRepository.js';
import * as UserRepository from '../../src/repositories/UserRepository.js';
import * as auth from '../../src/utils/auth.js';
import * as TransactionRepository from '../../src/repositories/TransactionRepository.js';
import { depositFund } from '../../src/controllers/TransactionController.js';

jest.mock('../../src/config/Database', () => {
    return { db: { transaction: (func) => func }}
});

const successResponse = (res, message, data) => {
    return { body: { success: true, message, data} };
};

const creditTransaction = {
    id: 1,
    user_id: 1,
    amount: 1000,
    type: 'credit',
    source: 'paymentProcessor'
};

const jwtInfo = {
    id: 1,
    iat: 1660211932,
    exp: 1660311932,
};

const errorResponse = (res, message, statusCode) => {
    return { 
        statusCode: statusCode || 500,
        body: { success: false, message }
    };
}

const res = { headers: {}, body: {}};

describe('transaction', () => {
    beforeEach(() => {
        jest.spyOn(BaseController, 'sendError')
            .mockImplementationOnce(errorResponse);
        
        jest.spyOn(BaseController, 'sendSuccess')
            .mockImplementationOnce(successResponse);
    });

    describe('deposit', () => {
        test('user can deposit fund', async () => {
            const amount = 100;
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(TransactionRepository, 'createTransaction')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve([1]))
                );
            jest.spyOn(UserRepository, 'incrementUserBalance')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve([1]))
                );
            jest.spyOn(TransactionRepository, 'findTransactionById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(creditTransaction))
                );

            const response = await depositFund(req, res);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject(creditTransaction);
        });
    });
})