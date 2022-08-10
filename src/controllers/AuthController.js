import isEmail from "validator/lib/isEmail.js";
import { createUser, findUserByEmail } from "../repositories/UserRepository.js";
import { checkPassword, generateJWT } from "../utils/auth.js";
import { errorResponse, successResponse } from "./BaseController.js";

export const register = async (req) => {
    if (!req.body.email) return errorResponse('The email field is required', 400);
    if (!req.body.password) return errorResponse('The password field is required', 400);
    if (!isEmail(req.body.email)) return errorResponse('The email provided in invalid.', 400);

    try {
        const [userId] = await createUser(req.body.email, req.body.password);
        return successResponse('Registration successful', {
            token: generateJWT(userId),
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return errorResponse('User with email already exist.', 400);
        }
        return errorResponse();
    }
};

export const login = async (req, res) => {
    if (!req.body.email) return errorResponse(res, 'The email field is required', 400);
    if (!req.body.password) return errorResponse(res, 'The password field is required', 400);
    if (!isEmail(req.body.email)) return errorResponse(res, 'The email provided in invalid.', 400);

    try {
        const user = await findUserByEmail(req.body.email);
        if (!user || !await checkPassword(req.body.password, user.password)) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }
        return successResponse(res, 'Successfully generated token.', {
            token: generateJWT(user.id),
        });
    } catch (err) {
        console.error(err); // NOTE: In prod, proper error logging system such as logstash or sentry would be used.
        return errorResponse(res, 'Error occured! Please try again later.');
    }

}