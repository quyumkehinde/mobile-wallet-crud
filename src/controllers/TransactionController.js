import db from "../config/database.js";
import { createTransaction, findTransactionById } from "../repositories/TransactionRepository.js";
import { decrementUserBalance, findUserById, incrementUserBalance } from "../repositories/UserRepository.js";
import { decryptJWT, isValidBearerToken } from "../utils/auth.js";
import { errorResponse, successResponse } from "./BaseController.js";
import { InsufficientBalanceException } from '../exceptions/TransactionExceptions.js'

export const depositFund = async (req, res) => {
    let token = req.headers.authorization;
    if (!isValidBearerToken(token)) {
        return errorResponse(res, 'Unauthorized!', 401);
    }
    if (!req.body.amount) {
        return errorResponse(res, 'The amount field is required', 400);
    }
    
    try {
        let transactionId;
        await db.transaction(async trx => {
            const { id: userId } = decryptJWT(token.split(' ')[1]);
            [transactionId] = await Promise.all([
                createTransaction(userId, req.body.amount, 'credit', 'paystack', trx),
                incrementUserBalance(userId, req.body.amount, trx),
            ]);
        });
        const transaction = await findTransactionById(transactionId[0]);
        return successResponse(res, 'Successfully funded account.', transaction);
    } catch (err) {
        console.error(err);
        return errorResponse(res, 'Error occured! Please try again.', 500);
    }
}

export const withdrawFund = async (req, res) => {
    let token = req.headers.authorization;
    if (!isValidBearerToken(token)) {
        return errorResponse(res, 'Unauthorized!', 401);
    }
    if (!req.body.amount) {
        return errorResponse(res, 'The amount field is required', 400);
    }

    let transactionId;
    try {
        await db.transaction(async trx => {
            const { id: userId } = decryptJWT(token.split(' ')[1]);
            const user = await findUserById(userId, trx);
            if (user.account_balance < req.body.amount) {
                throw new InsufficientBalanceException();
            }
            [transactionId] = await Promise.all([
                createTransaction(userId, req.body.amount, 'debit', 'withdrawal', trx),
                decrementUserBalance(userId, req.body.amount, trx),
            ]);
        });
        const transaction = await findTransactionById(transactionId[0]);
        return successResponse(res, 'Withdrawal has been processed successfully.', transaction);
    } catch (err) {
        console.error(err);
        if (err.name === 'InsufficientBalanceException') {
            return errorResponse(res, err.message, 400);
        }
        return errorResponse(res, 'Error occured! Please try again.', 500);
    }
}

export const transferFund = async (req, res) => {
    let token = req.headers.authorization;
    if (!isValidBearerToken(token)) {
        return errorResponse(res, 'Unauthorized!', 401);
    }
    if (!req.body.amount) {
        return errorResponse(res, 'The amount field is required', 400);
    }
    if (!req.body.recipient_id) {
        return errorResponse(res, 'The recipient_id field is required', 400);
    }
    const { id: userId } = decryptJWT(token.split(' ')[1]);
    const recipientId = req.body.recipient_id, amount = req.body.amount;
    if (recipientId === userId || !await findUserById(recipientId)) {
        return errorResponse(res, 'The recipient ID is invalid.', 400)
    }

    let transactionId;
    try {
        await db.transaction(async trx => {
            const [sender, recipient] = await Promise.all([
                findUserById(userId, trx),
                findUserById(recipientId, trx),
            ]);
            if (sender.account_balance < amount) {
                throw new InsufficientBalanceException();
            }
            [transactionId] = await Promise.all([
                createTransaction(sender.id, amount, 'debit', 'transfer', trx),
                decrementUserBalance(sender.id, amount, trx),
                createTransaction(recipient.id, amount, 'credit', 'transfer', trx),
                incrementUserBalance(recipient.id, amount, trx),
            ]);
        });
        const transaction = await findTransactionById(transactionId[0]);
        return successResponse(res, 'Transfer completed successfully.', transaction);
    } catch (err) {
        console.error(err);
        if (err.name === 'InsufficientBalanceException') {
            return errorResponse(res, err.message, 400);
        }
        return errorResponse(res, 'Error occured! Please try again.', 500);
    }
}

