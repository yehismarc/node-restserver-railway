import express from 'express';
import cors from 'cors';

import {router} from '../routes/user.js'
import { routerAuth } from '../routes/auth.js';
import { dbConnection } from '../db/config.js';

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

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
    }

    routes() {

        this.app.use(this.usersPath, router);
        this.app.use(this.authPath, routerAuth);
          
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