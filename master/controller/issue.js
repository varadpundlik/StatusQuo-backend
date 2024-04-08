const { Octokit } = require("@octokit/rest");
const config = require("../config/index");
const User = require("../models/user");
const Project = require("../models/project");
const askLLM = require("../service/askLLM");
const { fetchCodeUtil } = require("../controller/fetchCode");

const initGithub = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id }).exec();
    const owner = await User.findOne({ _id: project.user }).exec();

    const repositoryOwner = project.repository_owner || owner.github; // Replace with the repository owner's username
    const repositoryName = project.repository_name; // Replace with the repository name
    const accessToken = project.access_token || process.env.token;
    console.log(repositoryOwner + " " + repositoryName); // Your GitHub Personal Access Token
    console.log(accessToken);

    const octokit = new Octokit({ auth: accessToken });

    return { octokit, repositoryOwner, repositoryName };
};

async function addCommentToIssue(octokit, owner, repo, issueNumber, comment) {
    try {
        const response = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: comment,
        });
        console.log("Comment added to issue:", response.data.html_url);
    } catch (error) {
        console.error("Error adding comment to issue:", error.message);
        throw error;
    }
}

async function handleIssueEvent(payload, octokit, repositoryOwner, repositoryName) {
    try {
        const issueTitle = payload.issue.title;
        const issueBody = payload.issue.body;

        const issuePrompt = `A new issue titled "${issueTitle}" has been opened:\n\n${issueBody}\n\nPlease provide a response to the issue.`;
        console.log("Issue Prompt:", issuePrompt);

        const issueResponse = await askLLM(issuePrompt);
        console.log("LLM Issue Response:", issueResponse);

        // Add your logic to post the response back to GitHub using octokit
        // For example:
        await addCommentToIssue(octokit, repositoryOwner, repositoryName, payload.issue.number, issueResponse.response);
        console.log("Response posted successfully");

        const response = issueResponse.response;
        return { issuePrompt, response };
    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function fetchIssues(req, res) {
    try {
        const { octokit, repositoryOwner, repositoryName } = await initGithub(req, res);
        //const outputPath = await fetchCodeUtil(req, res);

        const { data: issues } = await octokit.rest.issues.listForRepo({
            owner: repositoryOwner,
            repo: repositoryName,
            state: "open",
        });
        let issueResponse = [];

        //add below loop in Promise all

        await Promise.all(
            issues.map(async issue => {
                console.log(issue.node_id);
                if (issue.node_id.charAt(0) === "I") {
                    const issueRes = await handleIssueEvent({ issue }, octokit, repositoryOwner, repositoryName);
                    const obj = { url : issue.url,title: issue.title, number: issue.number, username: issue.user.login, responce: issueRes };
                    await issueResponse.push(obj);
                }
            }),
        );
        console.log(issueResponse);
        return res.status(200).json(issueResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { fetchIssues };
