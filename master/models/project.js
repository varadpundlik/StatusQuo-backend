import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    description: String,
    repository_name: String,
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
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Project = mongoose.model("Project", projectSchema);
// just for PR api check 
// sasd
export default Project;
