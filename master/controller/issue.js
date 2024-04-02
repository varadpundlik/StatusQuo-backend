async function addCommentToIssue(owner, repo, issueNumber, comment) {
    try {
        const response = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: comment
        });
        console.log('Comment added to issue:', response.data.html_url);
    } catch (error) {
        console.error('Error adding comment to issue:', error.message);
        throw error;
    }
}

async function generateCommentWithLLM(prompt) {
    try {
        const response = await openai.completions.create({
            engine: 'text-davinci-003',
            prompt,
            max_tokens: 150,
            n: 1,
            stop: ['\n']
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating comment:', error.message);
        throw error;
    }
}

// Generate comment using LLM
const prompt = 'Please review this issue and provide feedback:';
const generatedComment = await generateCommentWithLLM(prompt);

// Add comment to issue
const owner = 'owner_username';
const repo = 'repository_name';
const issueNumber = 123; // Replace with actual issue number
await addCommentToIssue(owner, repo, issueNumber, generatedComment);
