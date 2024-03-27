const { initGithub } = require("./fetchCode");
const axios = require("axios");
const askLLM = require("../service/askLLM");
const { fetchCurrentCode } = require("./fetchCode");
const prompts = require("../constants/prompts");
const Project = require("../models/project");
const mongoose = require("mongoose");

const framePrompt = async id => {
    try {
        console.log(id);
        const project = await Project.findOne({ _id: id }).exec();
        const statusPrompt = prompts.statusPrompt;

        console.log(statusPrompt);

        const features = project.features;
        //append features json to statusPrompt string
        statusPrompt += features;
        return statusPrompt;
    } catch (error) {
        console.log(error);
    }
};

const getStatus = async (req, res) => {
    try {
        const { octokit, repositoryOwner, repositoryName } = await initGithub(req, res);
        const data = await fetchCurrentCode(req, res);

        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

framePrompt("65f27b9d92daab472e63c9dc");
