const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text from buffer based on file mimetype or filename extension
 */
async function parseResumeFile(fileBuffer, originalName, mimeType) {
  try {
    const ext = (originalName || '').split('.').pop().toLowerCase();

    if (mimeType === 'application/pdf' || ext === 'pdf') {
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value || '';
    }

    if (mimeType === 'application/msword' || ext === 'doc') {
      // Basic text extraction fallback for doc files
      return fileBuffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' ');
    }

    // Default plain text fallback
    return fileBuffer.toString('utf8');
  } catch (error) {
    console.error('[Resume Parser Error]:', error);
    throw new Error(`Failed to extract text from file (${originalName}): ${error.message}`);
  }
}

module.exports = { parseResumeFile };
