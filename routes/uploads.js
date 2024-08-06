import { Router } from 'express';
import { check } from 'express-validator';

import {validateFields, validateJWT, hasRole, isAdminRole, validateFile} from '../middlewares/index.js'
import { showImage, updateImage, uploadFiles } from '../controllers/uploads.js';
import { allowedCollections } from '../helpers/index.js';

const routerUpload = Router();

routerUpload.get('/:collection/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage);

routerUpload.post('/', [
    validateJWT,
    validateFile,
    validateFields
], uploadFiles);

routerUpload.put('/:collection/:id', [
    validateJWT,
    validateFile,
    check('id', 'No es un ID válido').isMongoId(),
    check('collection').custom( c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImage);


export {
    routerUpload
}