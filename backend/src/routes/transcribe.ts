import { Router } from 'express';
import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import { v2 as cloudinaryV2 } from 'cloudinary';

dotenv.config();  // Load environment variables

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI // Ensure the API key is loaded from .env
});

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

const router = Router();

// Define your transcription route
router.post('/transcribe', upload.single('audioFile'), async (req, res) => {
  const audio_file = req.file;
  if (!audio_file) {
    return res.status(400).json({ error: 'Audio File is required' });
  }

  console.debug("Uploading to Cloudinary");
  const cloudinaryRes = await cloudinaryV2.uploader.upload(audio_file.path, {
    resource_type: 'auto', 
    public_id: `audio_files/${Date.now()}`, 
  });

  console.debug("Uploaded Successfully");

  const config = {
    audio_url: cloudinaryRes.secure_url,
  };

  try {
    const transcript = await client.transcripts.transcribe(config);
    console.log('transcript', transcript);
    res.json({ transcript: transcript.text });  // Return transcribed text
  } catch (error) {
    res.status(500).json({ error: 'Error during transcription', details: error.message });
  }
});

// Export the router so it can be used in the app
export default router;
