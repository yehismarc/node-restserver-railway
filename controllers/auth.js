import { response } from "express";
import { User } from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { generateJWT } from "../helpers/generate_jwt.js";


const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        // Verify if the id exists
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }

        // If the user is active
        if(!user.status) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: false'
            });
        }

        // Verify the password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);


        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

export {
    login
}