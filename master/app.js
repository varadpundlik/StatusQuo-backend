const express = require("express");
const mongoose = require("mongoose");
const expressWs = require("express-ws");
const cors = require("cors");

const config = require("./config");
const routes = require("./routes");
const app = express();

app.use(express.json());
expressWs(app);
app.use(cors());

mongoose
    .connect(config.db_host)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

routes(app);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
