const Project = require('../models/project');

const fetchProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId }).exec();
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

module.exports= { fetchProject, createProject };