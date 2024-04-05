const axios = require("axios");
const askLLM = require("../service/askLLM");
const { fetchCodeUtil } = require("./fetchCode");
const prompts = require("../constants/prompts");
const Project = require("../models/project");
const mongoose = require("mongoose");

const framePrompt = async id => {
    try {
    //     console.log(id);
        const project = await Project.findOne({ _id: id }).exec();
        if (!project) {
            throw new Error(`Project with ID ${id} not found`);
        }
        
        let statusPrompt = prompts.statusPrompt || ''; // initialize to empty string if undefined
        // console.log(project);
        // console.log(statusPrompt);

        // append features json to statusPrompt string
        statusPrompt += JSON.stringify(project.features);
        return statusPrompt;
    } catch (error) {
        console.log(error);
        throw new Error(`Error framing prompt: ${error.message}`);
    }
};

const getStatus = async (req, res) => {
    try {
        const prompt = await framePrompt(req.params.projectId);
        // const outputPath = await fetchCodeUtil(req, res);
        const status = await askLLM(prompt);
        
        if (!status || !status.response || status.response === 'undefined') {
            throw new Error('Invalid response from askLLM');
        }
        console.log("-----------")
        console.log(status.response);
        
        const st = JSON.parse(status.response);
        if (!st) {
            throw new Error('Invalid JSON response');
        }
        
        st.date = new Date();
        
        const project = await Project.findOne({ _id: req.params.projectId }).exec();
        if (!project) {
            throw new Error(`Project with ID ${req.params.projectId} not found`);
        }
        
        project.statuses.push(st);
        await project.save();
        res.status(200).json(st);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getStatus };
