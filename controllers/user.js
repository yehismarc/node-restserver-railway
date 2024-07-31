import {request, response} from 'express';
import bcryptjs from 'bcryptjs';

import { User } from '../models/user.js';
import { isEmailExist } from '../helpers/validations_db.js';

const usersGet = async(req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    // const users = await User.find(query)
    //     .skip(Number(from))
    //     .limit(Number(limit));
    // const count = await User.countDocuments(query);

    const [count, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        count,
        users
    });
};

const usersPost = async(req, res = response) => {

    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    // Encrypt the password
    const salt = bcryptjs.genSaltSync();
    user.password = await bcryptjs.hashSync(password, salt);

    // Save DB
    await user.save();

    res.json({
        msg: 'post API - controlador',
        user
    });
};

const usersPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, email, ...rest } = req.body;

    // TODO Validate against DB
    if(password) {
        // Encrypt the password
        const salt = bcryptjs.genSaltSync();
        rest.password = await bcryptjs.hashSync(password, salt);
    }

    // Update DB
    const user = await User.findByIdAndUpdate(id, rest);

    res.json({
        user
    });
};

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'get API - controlador'
    });
};

const usersDelete = async(req, res = response) => {

    const {id} = req.params;

    const uid = req.uid;

    const user = await User.findByIdAndUpdate(id, {status: false});

    res.json({
        user
    });
};

export {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}