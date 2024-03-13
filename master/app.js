import fs from 'fs';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import PDFDocument from 'pdfkit';

dotenv.config();
const repositoryOwner = 'reponame'; // Replace with the repository owner's username
const repositoryName = 'ownername'; // Replace with the repository name
const accessToken = process.env.token; // Your GitHub Personal Access Token

const octokit = new Octokit({ auth: accessToken });

async function fetchCommitList() {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: repositoryOwner,
            repo: repositoryName
        });
        //console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching commit list:', error);
        throw error;
    }
}

async function fetchTree(commitSha) {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            owner: repositoryOwner,
            repo: repositoryName,
            tree_sha: commitSha,
            recursive: 1
        });
        //console.log(response.data.tree)
        return response.data.tree;
    } catch (error) {
        console.error('Error fetching tree:', error);
        throw error;
    }
}

async function generatePDF(commitList) {
    const doc = new PDFDocument();
    const outputPath = 'repository_code.pdf';

    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(24).text('Repository Code', { align: 'center' });
    doc.moveDown();

    let totalCommits = commitList.length;
    let commitCount = 0;

    for (const commit of commitList) {
        const commitMessage = commit.commit.message;
        const commitDate = commit.commit.author.date;
        const commitAuthor = commit.commit.author.name;
        const commitSha = commit.sha;

        doc.fontSize(18).text(`Commit: ${commitMessage} \nAuthor: ${commitAuthor} \nDate: ${commitDate}`, { continued: true });
        doc.moveDown();

        const tree = await fetchTree(commitSha);

        for (const file of tree) {
            if (file.type === 'blob') {
                const filePath = file.path;
                if (filePath.includes('.png') || filePath.includes('.jpg') || filePath.includes('.jpeg') || filePath.includes("lock") || filePath.includes("node_modules") || filePath.includes("gitignore")){
                    continue;
                }
                // Add file path to the PDF
                doc.fontSize(14).text(filePath, { continued: true });
                doc.moveDown();

                // Fetch file contents
                const { data } = await octokit.request('GET /repos/{owner}/{repo}/git/blobs/{file_sha}', {
                    owner: repositoryOwner,
                    repo: repositoryName,
                    file_sha: file.sha
                });

                const fileContents = Buffer.from(data.content, 'base64').toString('utf-8');
                doc.fontSize(10).text(fileContents, { indent: 20 });
                doc.moveDown();
            }
        }
        commitCount++;
        console.log(`Processed commit ${commitCount} of ${totalCommits}`);

        doc.moveDown();
    }

    doc.end();
    console.log(`PDF generated successfully: ${outputPath}`);
}

async function main() {
    try {
        const startTime = new Date();
        const commitList = await fetchCommitList();
        await generatePDF(commitList);
        const endTime = new Date();
        console.log(`Time taken: ${endTime - startTime}ms`);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
