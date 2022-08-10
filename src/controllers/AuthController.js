import isEmail from "validator/lib/isEmail.js";
import { createUser, findUserByEmail } from "../repositories/UserRepository.js";
import { checkPassword, generateJWT } from "../utils/auth.js";
import { sendError, sendSuccess } from "./BaseController.js";

export const register = async (req, res) => {
    if (!req.body.email) return sendError(res, 'The email field is required', 400);
    if (!req.body.password) return sendError(res, 'The password field is required', 400);
    if (!isEmail(req.body.email)) return sendError(res, 'The email provided in invalid.', 400);

    try {
        const [userId] = await createUser(req.body.email, req.body.password);
        return sendSuccess('Registration successful', {
            token: generateJWT(userId),
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return sendError(res, 'User with email already exist.', 400);
        }
        return errorResponse();
    }
};

export const login = async (req, res) => {
    if (!req.body.email) return sendError(res, 'The email field is required', 400);
    if (!req.body.password) return sendError(res, 'The password field is required', 400);
    if (!isEmail(req.body.email)) return sendError(res, 'The email provided in invalid.', 400);

    try {
        const user = await findUserByEmail(req.body.email);
        if (!user || !await checkPassword(req.body.password, user.password)) {
            return sendError(res, 'Invalid username or password.', 400);
        }
        return sendSuccess(res, 'Successfully generated token.', {
            token: generateJWT(user.id),
        });
    } catch (err) {
        console.error(err); // NOTE: In prod, proper error logging system such as logstash or sentry would be used.
        return sendError(res, 'Error occured! Please try again later.');
    }

}