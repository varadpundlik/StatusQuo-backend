const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;
const path = require('path');
const config = require("../config");

cloudinary.config({ 
  cloud_name: config.cloud_name, 
  api_key: config.cloud_api_key, 
  api_secret: config.cloud_api_secret 
});

const uploadPdf = async (pdfName, pdfPath) => {
  try {
    const result = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "auto",
      public_id: `ani/pdf/${pdfName}`,
      overwrite: true,
      allowed_formats: ['pdf']
    });
    
    const url = `http://res.cloudinary.com/anirudhac1/raw/upload/v1/ani/pdf/${pdfName}`;
    console.log('Upload Result:', result);
    console.log('PDF URL:', url);
    return url;

  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = { uploadPdf };
