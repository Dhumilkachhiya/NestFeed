import multer from "multer";
import path from "path"

// Use memory storage (stores images in memory as Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit each file to 5MB
});

// Middleware to handle both single & multiple file uploads
const uploadMiddleware = {
  single: upload.single("image"), // For single file upload
  multiple: upload.array("images", 10), // For multiple file uploads (up to 10)
};

// // Story-specific configuration ONLY
// const storyStorage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, `story-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// ✅ Use memory storage to get `req.file.buffer`
const storyStorage = multer.memoryStorage();

export const storyUpload = multer({
  storage: storyStorage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images/videos allowed"), false);
    }
  }
});
export const uploadSingle = upload.single("image"); // ✅ Export individual handlers
export const uploadMultiple = upload.array("images", 10);
export default upload;
