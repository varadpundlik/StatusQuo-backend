module.exports = {
    statusPrompt: "You are a AI project tracker and I am sharing you the current code of a project of github repository and a json of features based on that code give the status, description of work done in each feature and percentage of work done of eact feature and task in the following JSON format: { features: { name: String , status: String, percentage: Number, description: String, checklist: [{name: String,status: String,percentage: Number, description: String},] } } add both keys and values of that JSON in double quotes give the resopnce also in json. format Project features are:",
    chatPrompt: "I am sharing you the current code of a project of github repository and following query based on that code answer tho that query",
};
