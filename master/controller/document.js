const Document = require('../models/document');
const User = require('../models/user');

const addStringToDocument = async (req, res) => {
    const { string, user_id } = req.body;
    if (!string) {
        return res.status(400).json({ error: 'String is required' });
    }

    try {
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid user id' });
        }

        let document = await Document.findOne({ user: user_id });

        if (!document) {
            document = new Document({
                document_content: string,
                user: user_id,
            });
        } else {
            document.document_content += '\n' + string;
        }

        await document.save();

        res.status(200).json({ message: 'String added to document', document });
    } catch (error) {
        res.status(500).json({ error: 'Error adding string to document', error });
    }
};

const PDFDocument = require('pdfkit');

const genrate_pdf = async (req, res) => {
    try {
        const docid = req.params.id;
        
        const data = await Document.findOne({ user: docid });

        if (!data) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const doc = new PDFDocument();

        res.setHeader('Content-Disposition', 'attachment; filename="Document.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(12).text(`                                                        Project Document`);
        doc.fontSize(12).text(` `);
        doc.fontSize(12).text(`${data.document_content}`);

        doc.end();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { addStringToDocument ,genrate_pdf};

