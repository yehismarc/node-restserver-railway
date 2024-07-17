import {request, response} from 'express';


const usersGet = (req = request, res = response) => {

    const {q, nombre = 'No name', apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const usersPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
};

const usersPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - controlador',
        id
    });
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'get API - controlador'
    });
};

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
};

export {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}