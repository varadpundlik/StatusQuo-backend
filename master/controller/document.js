const Document = require('../models/document');

const addStringToDocument = async (req, res) => {
    const { string } = req.body;

    if (!string) {
        return res.status(400).json({ error: 'String is required' });
    }

    try {
        const newDocument = new Document({ string });
        await newDocument.save();

        res.status(200).json({ message: 'String added to document', document: newDocument });
    } catch (error) {
        res.status(500).json({ error: 'Error adding string to document' });
    }
};

module.exports = { addStringToDocument };

