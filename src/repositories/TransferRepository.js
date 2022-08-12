import { db } from '../config/Database.js';

export const createTransfer = async (creditId, debitId, amount, trx) => {
    let response = db('transfers').insert({
        credit_id: creditId,
        debit_id: debitId,
        amount,
    });
    if (trx) response = response.transacting(trx);
    return response;
};
