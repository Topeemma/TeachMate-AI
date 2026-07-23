import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromBuffer(file: Express.Multer.File): Promise<string> {
  if (!file || !file.buffer || file.buffer.length === 0) {
    return '';
  }

  const filename = file.originalname || '';
  const ext = filename.toLowerCase().split('.').pop() || '';
  const mime = (file.mimetype || '').toLowerCase();

  try {
    // PDF extraction using pure JS pdf-parse (Vercel serverless-safe)
    if (mime === 'application/pdf' || ext === 'pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const textResult = await parser.getText();
      const extracted = textResult && textResult.text ? textResult.text.trim() : '';
      try {
        await parser.destroy();
      } catch {
        // ignore cleanup warning
      }
      return extracted;
    }

    // DOCX extraction using pure JS mammoth (Vercel serverless-safe)
    if (
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mime === 'application/msword' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result && result.value ? result.value.trim() : '';
    }

    // Images (PNG/JPG/JPEG): Do NOT decode binary bytes as UTF-8 text
    if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg'].includes(ext)) {
      return '';
    }

    // Default plain text / TXT handling
    return file.buffer.toString('utf-8').trim();
  } catch (err: any) {
    console.warn(`[Document Extractor] Extraction warning for ${filename}:`, err?.message || err);
    return '';
  }
}
