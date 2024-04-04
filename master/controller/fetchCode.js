const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { Octokit } = require("@octokit/rest");
const Project = require("../models/project");
const User = require("../models/user");
const { fetchCommitList, fetchTree } = require("../service/fetchCodeServices");
const dotenv = require("dotenv");
dotenv.config();

const initGithub = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.projectId }).exec();
    console.log(project);
    const owner = await User.findOne({ _id: project.user }).exec();

    const repositoryOwner = project.repository_owner || owner.github.username; // Replace with the repository owner's username
    const repositoryName = project.repository_name; // Replace with the repository name
    const accessToken = project.access_token || process.env.token;
    console.log(repositoryOwner+" "+repositoryName) // Your GitHub Personal Access Token
    console.log(accessToken);

    const octokit = new Octokit({ auth: accessToken });

    return { octokit, repositoryOwner, repositoryName };
};

const fetchCurrentCode = async (req, res) => {
    try {
        const outputPath = await fetchCodeUtil(req, res);
        res.status(200).json({ message: `PDF generated successfully: ${outputPath}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fetchCodeUtil = async (req, res) => {
    const { octokit, repositoryOwner, repositoryName } = await initGithub(req, res);
    const doc = new PDFDocument();
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const outputPath = `${repositoryName}_${currentDate}_latest.pdf`;
    console.log(outputPath);

    const pdfPath = path.join(__dirname, `../../llm_service/Pdfs/${outputPath}`);
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(24).text("Repository Code", { align: "center" });
    doc.moveDown();

    const { data: tree } = await octokit.git.getTree({
        owner: repositoryOwner,
        repo: repositoryName,
        tree_sha: "HEAD",
        recursive: true,
    });

    for (const file of tree.tree) {
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
    doc.end();
    console.log("PDF generated successfully");
    const destinationPath = path.join(__dirname, `../../llm_service/Pdfs/${outputPath}`);
    fs.renameSync(pdfPath, destinationPath);
    return outputPath;
};

const fetchCommitWiseCode = async (req, res) => {

    var { octokit, repositoryOwner, repositoryName } = await initGithub(req, res);
    console.log("---------------")
    console.log(repositoryOwner)
    console.log(repositoryName)
    console.log("---------------")
    const doc = new PDFDocument();
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const outputPath = `${repositoryName}_${currentDate}_commitwise.pdf`;
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

        const tree = await fetchTree(octokit, commitSha, repositoryOwner, repositoryName);

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
    const destinationPath = path.join(__dirname, `../../llm_service/Pdfs/${outputPath}`);
    fs.renameSync(pdfPath, destinationPath);
    res.status(200).json({ message: `PDF generated successfully: ${outputPath}` });
};

module.exports = { fetchCurrentCode, fetchCodeUtil, fetchCommitWiseCode };
