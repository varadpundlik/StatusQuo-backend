const fetchCommitList = async(octokit,repositoryOwner, repositoryName)=> {
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

async function fetchTree(octokit,commitSha,repositoryOwner, repositoryName) {
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

module.exports= {
    fetchCommitList,
    fetchTree,
};
