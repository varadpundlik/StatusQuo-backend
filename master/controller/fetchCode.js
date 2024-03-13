import fs from "fs";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import PDFDocument from "pdfkit";
import Project from "../models/project.js";
import User from "../models/user.js";
import { fetchCommitList, fetchTree } from "../service/fetchCodeServices.js";

dotenv.config();

const initGithub = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.projectId }).exec();
    const repositoryOwner = await User.findOne({ _id: project.user }).exec();

    const repositoryOwnerGithub = repositoryOwner.github.username; // Replace with the repository owner's username
    const repositoryName = project.repository_name; // Replace with the repository name
    const accessToken = repositoryOwnerGithub.token || process.env.token; // Your GitHub Personal Access Token

    const octokit = new Octokit({ auth: accessToken });

    return { octokit, repositoryOwner, repositoryName };
};

const fetchCurrentCode = async (req, res) => {
    const { octokit, repositoryOwner, repositoryName } = initGithub(req, res);
    const doc = new PDFDocument();
    const outputPath = "repository_code.pdf";

    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(24).text("Repository Code", { align: "center" });
    doc.moveDown();

    for (const file of files) {
        const filePath = file.filename;
        if (filePath.includes(".png") || filePath.includes(".jpg") || filePath.includes(".jpeg") || filePath.includes("lock")) {
            continue;
        }
        // Add file path to the PDF
        doc.fontSize(14).text(filePath, { continued: true });
        doc.moveDown();

        // Fetch file contents
        const { data } = await octokit.request("GET /repos/{owner}/{repo}/git/blobs/{file_sha}", {
            owner: repositoryOwner,
            repo: repositoryName,
            file_sha: file.sha,
        });

        const fileContents = Buffer.from(data.content, "base64").toString("utf-8");
        doc.fontSize(10).text(fileContents, { indent: 20 });
        doc.moveDown();
    }
};

const fetchCommitWiseCode = async (req, res) => {
    const { octokit, repositoryOwner, repositoryName } = initGithub(req, res);
    const doc = new PDFDocument();
    const outputPath = "repository_code.pdf";
    const commitList = await fetchCommitList(octokit, repositoryOwner, repositoryName);

    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(24).text("Repository Code", { align: "center" });
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
            if (file.type === "blob") {
                const filePath = file.path;
                if (filePath.includes(".png") || filePath.includes(".jpg") || filePath.includes(".jpeg") || filePath.includes("lock") || filePath.includes("node_modules") || filePath.includes("gitignore")) {
                    continue;
                }
                // Add file path to the PDF
                doc.fontSize(14).text(filePath, { continued: true });
                doc.moveDown();

                // Fetch file contents
                const { data } = await octokit.request("GET /repos/{owner}/{repo}/git/blobs/{file_sha}", {
                    owner: repositoryOwner,
                    repo: repositoryName,
                    file_sha: file.sha,
                });

                const fileContents = Buffer.from(data.content, "base64").toString("utf-8");
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
};

export {
    fetchCurrentCode,
    fetchCommitWiseCode,
};
