import { Router } from 'express';
import { check } from 'express-validator';

import { isAdminRole, validateFields, validateJWT } from '../middlewares/index.js';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categories.js';
import { categoryWithIdExists } from '../helpers/validations_db.js';

const routerCategories = Router();

// Get all categories - public
routerCategories.get('/', getCategories);

// Get a category by id - public
routerCategories.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryWithIdExists),
    validateFields
], getCategory);

// Create a category - private - valid token
routerCategories.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory);

// Update a category by id - private - valid token
routerCategories.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryWithIdExists),
    validateFields
], updateCategory);

// Delete a category by id - private - admin
routerCategories.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryWithIdExists),
    validateFields
], deleteCategory);

export {
    routerCategories
}