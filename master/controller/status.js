const axios = require("axios");
const askLLM = require("../service/askLLM");
const { fetchCodeUtil } = require("./fetchCode");
const prompts = require("../constants/prompts");
const Project = require("../models/project");
const mongoose = require("mongoose");

const framePrompt = async id => {
    try {
        console.log(id);
        const project = await Project.findOne({ _id: id }).exec();
        let statusPrompt = prompts.statusPrompt;
        console.log(project);
        console.log(statusPrompt);

        //append features json to statusPrompt string
        statusPrompt += JSON.stringify(project);
        return statusPrompt;
    } catch (error) {
        console.log(error);
    }
};

const getStatus = async (req, res) => {
    try {
        const prompt = await framePrompt(req.params.projectId);
        const outputPath = await fetchCodeUtil(req, res);
        const status = await askLLM(prompt);
        console.log(status);
        res.status(200).send(status.response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStatus };
