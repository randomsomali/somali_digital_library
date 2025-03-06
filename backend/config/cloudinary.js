import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "SBL/resources",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx", "txt", "rtf"],
    access_mode: "authenticated",
    type: "private",
  },
});

// Configure multer with file size limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, TXT, and RTF files are allowed."
        )
      );
      return;
    }
    cb(null, true);
  },
});

// Function to generate signed URL for file download
const generateSignedUrl = async (publicId, expiresIn = 3600) => {
  try {
    const signedUrl = cloudinary.utils.private_download_url(publicId, "raw", {
      expires_at: Math.floor(Date.now() / 1000) + expiresIn, // Default 1 hour expiry
      attachment: true, // Forces download rather than preview
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

// Function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];
  return `${urlParts[urlParts.length - 2]}/${filename.split(".")[0]}`;
};

export { cloudinary, upload, generateSignedUrl, getPublicIdFromUrl };
