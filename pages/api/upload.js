// src/pages/api/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';

// Configure storage using Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Ensure this directory exists
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
});

// Initialize next-connect
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Apply Multer middleware
apiRoute.use(upload.single('file'));

// POST handler
apiRoute.post((req, res) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

export default apiRoute;

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};