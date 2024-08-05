import { request, response } from "express";
import { Category } from '../models/index.js';


const getCategories = async(req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    const [count, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        count,
        categories
    });

}

const getCategory = async(req, res = response) => {

    const {id} = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json({
        category
    });

}


const createCategory = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({name});

    if(categoryDB) {
        return res.status(400).json({
            msg: `La categoria ${categoryDB.name}, ya existe`
        });
    }

    // Generate data
    const data = {
        name,
        user: req.user._id
    }

    console.log(data);

    const category = new Category(data);

    // Save DB
    await category.save();

    res.status(201).json({
        category
    });

}

const updateCategory = async(req, res = response) => {

    const {id} = req.params;
    
    const {status, user, ...data} = req.body;

    const name = data.name.toUpperCase();

    data.name = name;
    data.user = req.user._id;

    const categoryExists = await Category.findOne({name});

    if(categoryExists) {
        return res.status(400).json({
            msg: `La categoria ${categoryExists.name}, ya existe`
        });
    }

    // Update DB
    const category = await Category.findByIdAndUpdate(id, data, {new: true});

    res.json(category);
}

const deleteCategory = async(req, res = response) => {

    const {id} = req.params;

    const uid = req.uid;

    const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true});

    res.json(category);

}

export {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}