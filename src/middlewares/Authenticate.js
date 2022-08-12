import { sendError } from '../controllers/BaseController.js';
import { isValidBearerToken } from '../utils/auth.js';

export const Authenticate = (req, res, next) => {
    let token = req.headers.authorization;
    if (!isValidBearerToken(token)) {
        return sendError(res, 'Unauthorized!', 401);
    }
    next();
};