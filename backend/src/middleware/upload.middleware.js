import multer from 'multer';
import cloudinary from 'cloudinary';
import { config } from 'dotenv';
import streamifier from 'streamifier';

config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer - memory storage (file is kept in RAM temporarily)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload single image to Cloudinary
export const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'betterplace',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadSingle = upload.single('photo');
export const uploadMultiple = upload.array('photos', 5);
