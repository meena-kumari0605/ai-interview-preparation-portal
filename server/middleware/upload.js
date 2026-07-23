const multer = require('multer');

// Store files in memory buffer for parsing PDF/DOCX
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype) || /\.(pdf|doc|docx|txt)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload PDF, DOC, or DOCX files.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload;
