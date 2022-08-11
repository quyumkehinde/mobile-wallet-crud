import http, {serverResponse} from 'http';
import * as BaseController from '../../src/controllers/BaseController.js';
import { createTransaction } from '../../src/repositories/TransactionRepository.js';
import * as UserRepository from '../../src/repositories/UserRepository.js';
import * as auth from '../../src/utils/auth.js';
import * as TransactionRepository from '../../src/repositories/TransactionRepository.js';
import { depositFund, withdrawFund } from '../../src/controllers/TransactionController.js';
import { InsufficientBalanceException } from '../../src/exceptions/TransactionExceptions.js';

jest.mock('../../src/config/Database', () => {
    return { db: { transaction: (func) => func() }}
});


const creditTransaction = {
    id: 1,
    user_id: 1,
    amount: 1000,
    type: 'credit',
    source: 'paymentProcessor'
};

const debitTransaction = {
    id: 1,
    user_id: 1,
    amount: 1000,
    type: 'debit',
    source: 'paymentProcessor',
};

const jwtInfo = {
    id: 1,
    iat: 1660211932,
    exp: 1660311932,
};

const user = {
    id: 1,
    email: 'mail@domain.com',
    account_balance: 100
};

const successResponse = (res, message, data) => {
    return { body: { success: true, message, data} };
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

    describe('depositFund', () => {
        test('user can deposit fund', async () => {
            const amount = 100;
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(UserRepository, 'findUserById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(user))
                );
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

        test('user get an error when an internal error occur', async () => {
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount: 100 }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(UserRepository, 'findUserById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(user))
                );
            jest.spyOn(TransactionRepository, 'createTransaction')
                .mockImplementationOnce(() => {
                    throw new Error('error')
                });
            jest.spyOn(UserRepository, 'incrementUserBalance')
                .mockImplementationOnce(() => {
                    new Promise(resolve => resolve([1]))
                });
            const response = await depositFund(req, res);
            expect(response.body.message).toBe('Error occured! Please try again.');
        });

        test('user get an error when amount is not specified', async () => {
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: {}
            };
            const response = await depositFund(req, res);
            expect(response.body.message).toBe('The amount field is required');
        });
    });

    describe('withdrawFund', () => {
        test('user can withdraw fund', async () => {
            const amount = 100;
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(UserRepository, 'findUserById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(user))
                );
            jest.spyOn(TransactionRepository, 'createTransaction')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve([1]))
                );
            jest.spyOn(UserRepository, 'decrementUserBalance')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve([1]))
                );
            jest.spyOn(TransactionRepository, 'findTransactionById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(debitTransaction))
                );

            const response = await withdrawFund(req, res);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject(debitTransaction);
        });

        test('user get an error when they do not have enough balance', async () => {
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount: 3000 }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(UserRepository, 'findUserById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(user))
                );
            const response = await withdrawFund(req, res);
            expect(response.body.message).toBe((new InsufficientBalanceException()).message);
        });

        test('user get an error when an internal error occur', async () => {
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: { amount: 100 }
            };
            jest.spyOn(auth, 'decryptJWT')
                .mockImplementationOnce(token => jwtInfo);
            jest.spyOn(UserRepository, 'findUserById')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve(user))
                );
            jest.spyOn(TransactionRepository, 'createTransaction')
                .mockImplementationOnce(() => {
                    throw new Error('error')
                });
            jest.spyOn(UserRepository, 'incrementUserBalance')
                .mockImplementationOnce(
                    () => new Promise(resolve => resolve([1]))
                );
            const response = await withdrawFund(req, res);
            expect(response.body.message).toBe('Error occured! Please try again.');
        });

        test('user get an error when amount is not specified', async () => {
            const req = { 
                headers: { authorization: 'Bearer token' },
                body: {}
            };
            const response = await withdrawFund(req, res);
            expect(response.body.message).toBe('The amount field is required');
        });
    });
});
