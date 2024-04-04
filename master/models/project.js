const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    repository_name: String,
    repository_url: String,
    repository_owner: String,
    access_token: String,
    features: [
        {
            name: String,
            checklist: [
                {
                    name: String,
                    status: Boolean,
                },
            ],
        },
    ],
    statuses: [
        {
            date: Date,
            features: [
                {
                    name: String,
                    status: String,
                    percentage: Number,
                    description: String,
                    checklist: [
                        {
                            name: String,
                            status: String,
                            percentage: Number,
                            description: String,
                        },
                    ],
                },
            ],
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Project = mongoose.model("Project", projectSchema);

module.exports= Project;
