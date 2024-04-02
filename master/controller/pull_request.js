const { Octokit } = require('@octokit/rest');
const config = require('../config/index')


console.log('Token:', config.token);
const octokit = new Octokit({
    auth: config.token
});

async function handlePullRequestEvent(payload) {
    const prTitle = payload.pull_request.title;
    const prBody = payload.pull_request.body;

    const reviewPrompt = `A new pull request titled "${prTitle}" has been opened:\n\n${prBody}\n\nPlease review and provide feedback.`;
    console.log('Review Prompt:', reviewPrompt);

    // const reviewResponse = await askLLM(reviewPrompt);
    // console.log('LLM Review:', reviewResponse);

    // Add your logic to post the review comment back to GitHub using octokit
    // For example:
    // await octokit.rest.pulls.createReview({
    //     owner: 'owner_username',
    //     repo: 'repository_name',
    //     pull_number: payload.pull_request.number,
    //     body: reviewResponse,
    //     event: 'COMMENT' // or 'APPROVE', 'REQUEST_CHANGES', etc.
    // });
}

// Example usage:
// handlePullRequestEvent(payload);
// Example: Listen for a new pull request event
async function listenForPullRequests() {
    try {
        const response = await octokit.request('GET /repos/PICT-ACM-Student-Chapter/Pasc_Backend_Alumni_2.0/pulls');
        // Process the response and trigger the appropriate function
        console.log('Pull Requests:', response.data);
        response.data.forEach(pr => {
            handlePullRequestEvent({ pull_request: pr });
        });
        return response;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Call the function to start listening for pull requests
listenForPullRequests();
