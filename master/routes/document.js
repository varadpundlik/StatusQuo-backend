const express = require("express");
const documentController = require("../controller/document");
const documentRouter = express.Router();

documentRouter.post("/add_to_document", documentController.addStringToDocument);
documentRouter.get("/genrate_document/:id", documentController.genrate_pdf);
module.exports = documentRouter;
