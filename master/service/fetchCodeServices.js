const fetchCommitList = async(octokit, repositoryOwner, repositoryName)=> {
    try {
        const response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: repositoryOwner,
            repo: repositoryName,
        });
        //console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching commit list:", error);
        throw error;
    }
}

async function fetchTree(commitSha) {
    try {
        const response = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
            owner: repositoryOwner,
            repo: repositoryName,
            tree_sha: commitSha,
            recursive: 1,
        });
        //console.log(response.data.tree)
        return response.data.tree;
    } catch (error) {
        console.error("Error fetching tree:", error);
        throw error;
    }
}

async function fetchLatestCommit(octokit, repositoryOwner, repositoryName) {
    try {
        const response = await octokit.repos.getLatestCommit({
            owner: repositoryOwner,
            repo: repositoryName,
        });
        return response.data.sha;
    } catch (error) {
        console.error("Error fetching latest commit:", error);
        throw error;
    }
}

async function fetchFiles(commitSha) {
    try {
        const response = await octokit.repos.getCommit({
            owner: repositoryOwner,
            repo: repositoryName,
            ref: commitSha,
        });
        return response.data.files;
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
    }
}

export {
    fetchCommitList,
    fetchTree,
    fetchLatestCommit,
    fetchFiles,
};
