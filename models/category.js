import {Schema, model} from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status : {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

categorySchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

const Category = model('Category', categorySchema);

export {
    Category
}