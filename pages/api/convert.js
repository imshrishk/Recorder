// src/pages/api/convert.js

import nextConnect from 'next-connect';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = file.path;
  const outputPath = inputPath.replace('.webm', '.mp4');

  try {
    await execAsync(`ffmpeg -i ${inputPath} -c:v libx264 -crf 23 -c:a aac ${outputPath}`);
    
    // Delete the original WebM file
    fs.unlinkSync(inputPath);

    const relativePath = outputPath.replace('public', '');
    res.status(200).json({ url: relativePath });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};