import { Router } from 'express';
import { search } from '../controllers/search.js';

const routerSearch = Router();

routerSearch.get('/:collection/:term', search)



export {
    routerSearch
}