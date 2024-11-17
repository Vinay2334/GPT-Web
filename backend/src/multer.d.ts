import { Request } from 'express';
import { File } from 'multer';  // Import Multer File type

declare global {
  namespace Express {
    interface Request {
      file?: File;        // For single file uploads
      files?: File[];     // For multiple file uploads
    }
  }
}
