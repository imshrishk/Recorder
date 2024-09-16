import nextConnect from 'next-connect';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/utils/firebaseConfig'; // Import Firebase config

const execAsync = promisify(exec);

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('API Error:', error); // Log error for debugging
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

  const videoId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const inputFileName = `${videoId}.webm`;
  const outputFileName = `${videoId}.mp4`;
  const tempInputPath = path.join('/tmp', inputFileName);
  const tempOutputPath = path.join('/tmp', outputFileName);

  try {
    // Save the uploaded WebM file temporarily
    fs.writeFileSync(tempInputPath, file.buffer);

    // Use ffmpeg to convert WebM to MP4
    await execAsync(`ffmpeg -i ${tempInputPath} -c:v libx264 -crf 23 -c:a aac ${tempOutputPath}`);

    // Read the converted MP4 file into a buffer
    const convertedBuffer = fs.readFileSync(tempOutputPath);

    // Upload the converted MP4 file to Firebase Storage
    const storageRef = ref(storage, `videos/${outputFileName}`);
    const snapshot = await uploadBytes(storageRef, convertedBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Create or update the document in Firestore
    const videoRef = doc(db, 'videos', videoId);
    await setDoc(videoRef, {
      originalName: inputFileName,
      videoId,
      filePath: downloadURL, // Firebase Storage URL
      format: '.mp4', // File format
      uploadDate: new Date(),
    }, { merge: true }); // Use merge to create or update document

    // Cleanup: remove temporary files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    res.status(200).json({ url: downloadURL, videoId });
  } catch (error) {
    console.error('Conversion error:', error); // Detailed error logging
    res.status(500).json({ error: 'Conversion failed' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};
