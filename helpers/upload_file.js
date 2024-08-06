import path from 'path';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid'

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadFile = (files, validExtension = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const {file} = files;

        const shortName = file.name.split('.');
        const extension = shortName[shortName.length - 1];
        
        // Validate extension
        if(!validExtension.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${validExtension}`);
        }
    
        console.log(shortName);
    
        const tempName = uuidv4() + '.' + extension;
      
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
    
        // Check if the 'uploads' folder exists, if not create one
        if (!fs.existsSync(path.join(__dirname, '../uploads', folder))) {
            fs.mkdirSync(path.join(__dirname, '../uploads', folder));
        }
      
        file.mv(uploadPath, (err) => {
          if (err) {
            return reject(err);
          }
      
          return resolve(tempName);
        });
        
    });



}


export {
    uploadFile
}