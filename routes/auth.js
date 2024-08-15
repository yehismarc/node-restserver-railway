import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login, renewToken } from '../controllers/auth.js';
import { isEmailExist } from '../helpers/validations_db.js';
import { validateFields, validateJWT } from '../middlewares/index.js';

const routerAuth = Router();

routerAuth.post('/login', [
    //check('email').custom(isEmailExist).isEmail(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

routerAuth.post('/google', [
    check('id_token', 'El token de google es obligatorio').not().isEmpty(),
    validateFields
], googleSignIn);

routerAuth.get('/', validateJWT, renewToken);

export {
    routerAuth
}