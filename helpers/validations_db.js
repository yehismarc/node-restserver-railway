import { Role } from '../models/role.js';
import { User } from '../models/user.js';

const isRoleValid = async(role = '') => {
    const existsRole = await Role.findOne({role});
    if(!existsRole) {
        throw new Error(`El rol ${role} no está registrado en la DB`);
    }
}

const isEmailExist = async(email = '') => {
    // Verify if the email exists
    const emailExists = await User.findOne({email});
    
    if(emailExists) {
        throw new Error(`El correo: ${email}, ya está registrado`);
        // return res.status(400).json({
        //     msg: 'EL correo ya está registrado'
        // });
    }

}

const userWithIdExists = async(id) => {
    // Verify if the id exists

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const userExists = await User.findById(id);
    
        if(!userExists) {
            throw new Error(`El id no existe ${id}`);
        }
    }


}



export {
    isRoleValid,
    isEmailExist,
    userWithIdExists
}