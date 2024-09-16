import nextConnect from 'next-connect';
import multer from 'multer';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/utils/firebaseConfig'; // Import Firebase config

// Setup multer to handle file uploads in memory
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

// Handle file upload
apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { originalname: originalName, buffer } = req.file;
  if (!originalName || !buffer) {
    return res.status(400).json({ error: 'No file uploaded or file has no data' });
  }

  const videoId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const storageRef = ref(storage, `videos/${videoId}-${originalName}`);

  try {
    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, buffer);

    // Get the file's download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Store video metadata in Firestore
    const videoRef = doc(db, 'videos', videoId);
    await setDoc(videoRef, {
      originalName,
      videoId,
      filePath: downloadURL, // Firebase Storage URL
      format: snapshot.metadata.contentType, // File format (e.g., video/webm)
      uploadDate: new Date(),
    });

    res.status(200).json({ message: 'File uploaded successfully', videoId, downloadURL });
  } catch (error) {
    console.error('Error uploading file:', error); // Detailed error logging
    res.status(500).json({ error: 'Error uploading file to Firebase Storage' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};
