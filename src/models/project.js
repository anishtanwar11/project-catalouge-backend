import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        techStack: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        liveLink: {
            type: String,
        },
        sourceCodeLink: {
            type: String,
        },
        imageUrl: {
            type:String,
            required:true,   
        }
    }
)

const Project = mongoose.model('Project', projectSchema);
export default Project;