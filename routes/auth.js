import { Router } from 'express';
import { check } from 'express-validator';
import { login } from '../controllers/auth.js';
import { isEmailExist } from '../helpers/validations_db.js';
import { validateFields } from '../middlewares/validations.js';

const routerAuth = Router();

routerAuth.post('/login', [
    //check('email').custom(isEmailExist).isEmail(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

export {
    routerAuth
}