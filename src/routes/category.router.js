import express from 'express';
const router = express.Router();
import Category from '../models/category.js';

router.post('/', async(req, res) => {
    const{ category } = req.body;
    try {
        const newCategory = new Category({category});
        await newCategory.save();
        res.status(200).json({message:"Category created successfuly"});
    } catch (error) {
        res.status(500).json({message:"Error creating category"});
    }
})

router.get('/', async(req, res) => {
    const categories = await Category.find();
    if(!categories){
        return res.status(404).json({message: "No categories found"});
    }else{
        res.status(200).json(categories);
    }
})
export default router;