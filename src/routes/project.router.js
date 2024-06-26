import dotenv from 'dotenv';
dotenv.config();

import Project from '../models/project.js';
import {v2 as cloudinary} from 'cloudinary';
import express from 'express';

const router = express.Router();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Route for creating newproject
router.post('/add', async (req, res) => {
    console.log(req.body);
    const { name, description, techStack, category, liveLink, sourceCodeLink } = req.body;
    const file = req.files.imageUrl;
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=> {
        console.log(result);
        const imageUrl = result.url;
        try {
            // Create new project object with image URL
            const newProject = new Project({name, description,techStack, category, liveLink, sourceCodeLink, imageUrl});
            // Save project to database
            await newProject.save();
            // Respond with success message
            res.status(200).json({ message: 'Project added successfully!'});
        } catch (error) {
            console.error("Error adding project:", error);
            res.status(500).json({ message: 'Error adding project', error: error.message });
        } 
    }) 
});



// Get all projects
router.get('/', async (req, res) => {
    try {
      const projects = await Project.find().sort({_id:-1});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

//Get projects by ID
router.get('/:userId', async(req, res) => {
    const userId = req.params.userId;
    try {
        const project = await Project.findById(userId);
        if(!project){
            return res.status(400).json({message: 'Project Not Found!'})
        }
        res.json(project);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// Get projects by category
router.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
      const projects = await Project.find({ category }).sort( { _id : -1} );
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get project Categories
router.get('/category', async (req, res) => {
    try {
        const categories = await Project.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error finding categories" });
    }
});

export default router;