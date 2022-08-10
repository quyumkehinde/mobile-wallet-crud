import db from "../config/Database.js";
import { hashPassword } from "../utils/auth.js";

export const createUser = async (email, password) => {
    return db('users').insert({
        email,
        password: await hashPassword(password)
    });
}

export const findUserByEmail = async (email) => {
    return db('users').where('email', email).first();
}

export const findUserById = async (id, trx) => {
    let response = db('users')
        .where('id', id)
        .first();
    if (trx) response = response.transacting(trx);
    return response;
}

export const incrementUserBalance = async (id, amount, trx) => {
    let response = db('users')
        .where('id', id)
        .increment('account_balance', amount);
    if (trx) response = response.transacting(trx);
    return response;
}

export const decrementUserBalance = async (id, amount, trx) => {
    let response = db('users')
        .where('id', id)
        .decrement('account_balance', amount);
    if (trx) response = response.transacting(trx);
    return response;
}
