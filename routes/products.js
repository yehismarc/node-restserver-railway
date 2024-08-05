import { Router } from 'express';
import { check } from 'express-validator';

import { isAdminRole, validateFields, validateJWT } from '../middlewares/index.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products.js';
import { categoryWithIdExists, productWithIdExists } from '../helpers/validations_db.js';

const routerProducts = Router();

// Get all categories - public
routerProducts.get('/', getProducts);

// Get a category by id - public
routerProducts.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productWithIdExists),
    validateFields
], getProduct);

// Create a category - private - valid token
routerProducts.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID válido').isMongoId(),
    check('category').custom(categoryWithIdExists),
    validateFields
], createProduct);

// Update a category by id - private - valid token
routerProducts.put('/:id', [
    validateJWT,
    //check('category', 'No es un ID válido').isMongoId(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productWithIdExists),
    validateFields
], updateProduct);

// Delete a category by id - private - admin
routerProducts.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productWithIdExists),
    validateFields
], deleteProduct);

export {
    routerProducts
}