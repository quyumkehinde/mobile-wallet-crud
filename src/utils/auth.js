import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from "../config.js";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateJWT = (userId) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    });
}

export const decryptJWT = (token) => {
    return jwt.decode(token);
}

export const isValidBearerToken = (token) => {
    try {
        if (!token || !token.startsWith('Bearer ') || !jwt.verify(token.split(' ')[1], config.JWT_SECRET)) {
            return false;
        }
        const { iat, exp } = decryptJWT(token.split(' ')[1]);
        const timeStamp = Math.floor(Date.now() / 1000);

        if (iat > timeStamp || exp < timeStamp) {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}