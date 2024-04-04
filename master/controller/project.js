const Project = require('../models/project');
const User = require('../models/user');

const fetchProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId }).exec();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const fetchAllProject = async (req, res) => {
    try {
        const project = await Project.findOne({ }).exec();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    const project = new Project(req.body);
    try {
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyProjects = async (req, res) => {
    try {
        const user= await User.findOne({ email: req.params.email }).exec();
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const projects = await Project.find({ user: user._id }).exec();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports= { fetchProject, createProject,fetchAllProject,getMyProjects };
