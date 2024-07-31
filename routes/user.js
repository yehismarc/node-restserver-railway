
import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields } from '../middlewares/validations.js';
import { isEmailExist, isRoleValid, userWithIdExists } from '../helpers/validations_db.js';

import { 
    usersDelete, 
    usersGet, 
    usersPatch, 
    usersPost, 
    usersPut 
} from '../controllers/user.js';

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser más de 6 letras').isLength({min: 6}),
    //check('email', 'El correo no es valido').isEmail(),
    check('email').custom(isEmailExist).isEmail(),
    //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //check('role').custom((role) => isRoleValid(role)),
    check('role').custom(isRoleValid),
    validateFields
], usersPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userWithIdExists),
    check('role').custom(isRoleValid),
    validateFields
], usersPut);

router.patch('/', usersPatch);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userWithIdExists),
    validateFields
], usersDelete);




export {
    router
}