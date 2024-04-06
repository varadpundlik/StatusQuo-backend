const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function uploadFile(filePath) {
    //replace \ with / in the file path
    filePath = filePath.replace(/\\/g, "/");
    console.log("Uploading file:", filePath);
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const url = "http://localhost:6000/uploadfile/";

    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(response.data.message);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

uploadFile("D:/cs programs/ProjectAI/master/StatusQuo-backend_20240406_latest.pdf")

// module.exports = {uploadFile};