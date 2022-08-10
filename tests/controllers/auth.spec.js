import http, {serverResponse} from 'http';
import {register} from '../../src/controllers/AuthController.js'; 
import * as BaseController from '../../src/controllers/BaseController.js';
import * as UserRepository from '../../src/repositories/UserRepository.js';
import * as auth from '../../src/utils/auth.js';

describe('authentication', () => {
    const res = http.request();
    describe('registration', () => {
        test('user can create an account', async () => {
            const req = { body: { email: 'test@domain.com', password : 'password' } };
            jest.spyOn(UserRepository, 'createUser')
                .mockImplementationOnce(() => [1]);
            jest.spyOn(auth, 'generateJWT')
                .mockImplementationOnce(string => 'token');
            const response = await register(req, res);
            expect(response.data.token).toBe('token');
        });

        // test('user gets an error when email is invalid', function () {
        //     const req = { body: { password : 'password' } };
        //     jest.spyOn(BaseController, 'errorResponse')
        //         .mockImplementationOnce((res, message) => {
        //             return {data, message};
        //         });
        //     const response = await register(req, res);
        //     expect(response.message).toBe('The email provided in invalid.');
        // });
    });
})