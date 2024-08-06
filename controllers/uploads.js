import path from 'path';
import fs from 'fs';
import { response } from "express";
import { uploadFile } from "../helpers/index.js";

import { User, Product } from '../models/index.js'

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const uploadFiles = async(req, res = response) => {

    try {

        // txt, md
        // const name = await uploadFile(req.files, ['txt','md'], 'texts');
        
        const name = await uploadFile(req.files, undefined, 'imgs');

        res.json({
            name
        });
        
    } catch (msg) {
        res.status(400).json({msg});
    }
  
}

const updateImage = async(req, res = response) => {

    const {id, collection} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }

            break;

        case 'products':
            model = await Product.findById(id);
            
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'No validado!'
            });
    }

    // Clean previous images
    if(model.img) {
        // Delete image from server
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);

        if(fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name

    await model.save();


    res.json(model);
}

const showImage = async(req, res = response) => {

    const {id, collection} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }

            break;

        case 'products':
            model = await Product.findById(id);
            
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({
                msg: 'No validado!'
            });
    }

    // Clean previous images
    if(model.img) {
        // Delete image from server
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);

        if(fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathNoImage);

}


export {
    uploadFiles,
    updateImage,
    showImage
}