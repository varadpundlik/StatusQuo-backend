const { Octokit } = require("@octokit/rest");
const config = require("../config/index");
const User = require("../models/user");
const Project = require("../models/project");
const askLLM = require("../service/askLLM");
const fetchCodeUtil = require("../controller/fetchCode");

const initGithub = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id }).exec();
    const owner = await User.findOne({ _id: project.user }).exec();

    const repositoryOwner = owner.github.username; // Replace with the repository owner's username
    const repositoryName = project.repository_name; // Replace with the repository name
    const accessToken = process.env.token;
    console.log(repositoryOwner + " " + repositoryName); // Your GitHub Personal Access Token
    console.log(accessToken);

    const octokit = new Octokit({ baseUrl: "https://api.github.com", auth: accessToken });

    return { octokit, repositoryOwner, repositoryName };
};

async function handlePullRequestEvent(payload, octokit, repositoryOwner, repositoryName) {
    try {
        const prTitle = payload.pull_request.title;
        const prBody = payload.pull_request.body;

        // Fetch code changes from the pull request
        const { data: diff } = await octokit.rest.pulls.get({
            owner: repositoryOwner,
            repo: repositoryName,
            pull_number: payload.pull_request.number,
            mediaType: {
                format: "diff", // Get the diff format of the changes
            },
        });

        const reviewPrompt = `You are a PR reviewer A new pull request titled "${prTitle}" has been opened:\n\n${prBody}\n\nCode Changes:\n${diff}\n\nPlease review and provide feedback regarding any changes if required or whether it should be merged or not.`;
        console.log("Review Prompt:", reviewPrompt);

        const reviewResponse = await askLLM(reviewPrompt);
        console.log("LLM Review:", reviewResponse);

        // Add your logic to post the review comment back to GitHub using octokit
        // For example:
        await octokit.rest.pulls.createReview({
            owner: repositoryOwner,
            repo: repositoryName,
            pull_number: payload.pull_request.number,
            body: reviewResponse.response,
            event: "COMMENT", // or 'APPROVE', 'REQUEST_CHANGES', etc.
        });
        console.log("Review comment posted successfully");

        const response = reviewResponse.response;
        return { reviewPrompt, response };
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Example usage:
// handlePullRequestEvent(payload);
// Example: Listen for a new pull request event
async function listenForPullRequests(req, res) {
    try {
        const { octokit, repositoryOwner, repositoryName } = await initGithub(req, res);
        const resp = await octokit.rest.pulls.list({
            owner: repositoryOwner,
            repo: repositoryName,
            state: "open",
        });

        let prs = [];
        // Process the response and trigger the appropriate function
        console.log("Pull Requests:", resp.data);

        await Promise.all(
            resp.data.map(async pr => {
                if (pr.node_id.charAt(0) === "P") {
                    const { reviewPrompt, response } = await handlePullRequestEvent({ pull_request: pr }, octokit, repositoryOwner, repositoryName);
                    console.log("Review Prompt:", reviewPrompt);
                    console.log("Response:", response);
                    await prs.push({ pr:reviewPrompt, review:response, number:pr.number, title:pr.title, body:pr.body, user:pr.user.login, url:pr.url});
                }
            }),
        );

        res.status(200).json({ message: "Pull Requests processed successfully", prs });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = listenForPullRequests;
