import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import {router} from '../routes/user.js'
import { routerAuth } from '../routes/auth.js';
import { dbConnection } from '../db/config.js';
import { routerCategories } from '../routes/categories.js';
import { routerProducts } from '../routes/products.js';
import { routerSearch } from '../routes/search.js';
import { routerUpload } from '../routes/uploads.js';

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        // Connection DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Routes app
        this.routes();

    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Parsing and reading the body
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));

        // Upload file
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            // createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.users, router);
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.categories, routerCategories);
        this.app.use(this.paths.products, routerProducts);
        this.app.use(this.paths.search, routerSearch);
        this.app.use(this.paths.uploads, routerUpload);
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

export {
    Server
}