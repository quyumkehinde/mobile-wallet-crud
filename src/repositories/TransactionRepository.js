import {db} from "../config/Database.js"

export const createTransaction = async (userId, amount, type, source, trx) => {
    let response = db('transactions').insert({
        user_id: userId,
        amount,
        type,
        source,
    });
    if (trx) response = response.transacting(trx);
    return response;
}

export const findTransactionById = async (id) => {
    return db('transactions').where('id', id).first();
}