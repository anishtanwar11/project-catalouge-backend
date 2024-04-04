import multer from 'multer';
import Project from '../models/project.js';

import express from 'express';

const router = express.Router();

// Set up multer Storage
const Storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/Images')
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: Storage }); 

router.post('/upload', upload.single("imageUrl"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: "No file uploaded"});
    }

    const imageUrl = req.file.filename;
    res.json({ imageUrl: imageUrl});
})

router.post('/add', upload.single('imageUrl'), async(req, res) => {
    const { name, description, techStack, category, liveLink, sourceCodeLink } = req.body;
    const imageUrl = req.file.filename;

    try {
        const newProject = new Project({ name, description, techStack, category, liveLink, sourceCodeLink, imageUrl});
        await newProject.save();
        res.status(200).json('Project added successfuly!')
    } catch (error) {
        res.status(400).json({ message: "Error adding project" });
    }
})

// Get all projects
router.get('/', async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

//Get projects by ID
router.get('/:name', async(req, res) => {
    const projectName = req.params.name;
    try {
        const project = await Project.findOne({ name: projectName });
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
      const projects = await Project.find({ category });
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