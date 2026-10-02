const multer = require('multer');

// Memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Mock/Cloudinary image handler (returns base64 data URI or Cloudinary URL)
async function uploadImageToCloud(fileBuffer, originalName) {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo') {
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'localfix' }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
        stream.end(fileBuffer);
      });
      return result.secure_url;
    } catch (err) {
      console.warn('Cloudinary upload warning, fallback to Data URL:', err.message);
    }
  }

  // Fast dev fallback: Convert buffer to base64 Data URL
  const mime = originalName.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${fileBuffer.toString('base64')}`;
}

module.exports = { upload, uploadImageToCloud };
