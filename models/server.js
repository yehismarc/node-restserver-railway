import express from 'express';
import cors from 'cors';

import {router} from '../routes/user.js'

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usersPath = '/api/users';

        // Middlewares
        this.middlewares();

        // Routes app
        this.routes();

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
