import { request, response } from "express";
import { Product } from '../models/index.js';


const getProducts = async(req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    const [count, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('category', 'name')
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        count,
        products
    });

}

const getProduct = async(req, res = response) => {

    const {id} = req.params;

    const product = await Product.findById(id)
                                    .populate('category', 'name')
                                    .populate('user', 'name');

    res.json({
        product
    });

}


const createProduct = async(req, res = response) => {

    const {statu, user, ...body} = req.body;

    const productDB = await Product.findOne({name: body.name});

    if(productDB) {
        return res.status(400).json({
            msg: `El producto ${productDB.name}, ya existe`
        });
    }

    // Generate data
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    console.log(data);

    const product = new Product(data);

    // Save DB
    await product.save();

    res.status(201).json({
        product
    });

}

const updateProduct = async(req, res = response) => {

    const {id} = req.params;
    
    const {status, user, ...data} = req.body;

    if(data.name) {
        data.name = data.name.toUpperCase();;
    }

    // const productExists = await Product.findOne({name});

    // if(productExists) {
    //     return res.status(400).json({
    //         msg: `El producto ${productExists.name}, ya existe`
    //     });
    // }

    data.user = req.user._id;

    // Update DB
    const product = await Product.findByIdAndUpdate(id, data, {new: true});

    res.json(product);
}

const deleteProduct = async(req, res = response) => {

    const {id} = req.params;

    const uid = req.uid;

    const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true});

    res.json(product);

}

export {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}