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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  }
});

// Upload single image to Cloudinary
export const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'betterplace',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        resource_type: 'image'
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
