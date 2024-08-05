import { response } from "express";
import mongoose from 'mongoose'

import {User, Category, Product} from '../models/index.js'

const permittedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(term = '', res = response) => {

    const isMongoId = mongoose.Types.ObjectId.isValid(term); // TRUE

    if (isMongoId) {
        const user = await User.findById(term);

        return res.json({
            count: 1,
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {
        $or: [{name: regex}, {email: regex}],
        $and: [{status: true}]
    }

    const [count, users] = await Promise.all([
       User.countDocuments(query),
       User.find(query)
    ]);

    //const users = await User.find(query);

    res.json({
        count,
        results: users
    })

}

const searchCategories = async(term = '', res = response) => {

    const isMongoId = mongoose.Types.ObjectId.isValid(term); // TRUE

    if (isMongoId) {
        const category = await Category.findById(term);

        return res.json({
            count: 1,
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {name: regex, status: true}

    const [count, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);

    //const categories = await Category.find(query);

    res.json({
        count,
        results: categories
    })

}

const searchProducts = async(term = '', res = response) => {

    const isMongoId = mongoose.Types.ObjectId.isValid(term); // TRUE

    if (isMongoId) {
        const product = await Product.findById(term)
                                        .populate('category', 'name')
                                        .populate('user', 'name');

        return res.json({
            count: 1,
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const query = {name: regex, status: true}

    const [count, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('category', 'name')
            .populate('user', 'name')
    ]);

    //const products = await Product.find(query);

    res.json({
        count,
        results: products
    })

}


const search = (req, res = response) => {

    const {collection, term} = req.params;

    if(!permittedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${permittedCollections}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
            break;
    }

}


export {
    search
}