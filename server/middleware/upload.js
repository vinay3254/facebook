const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'facebook_clone/general';
    if (req.baseUrl.includes('users')) folder = 'facebook_clone/profiles';
    if (req.baseUrl.includes('posts')) folder = 'facebook_clone/posts';
    if (req.baseUrl.includes('stories')) folder = 'facebook_clone/stories';
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'avi', 'webm', 'mkv']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: isVideo
        ? [{ quality: 'auto' }]
        : [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB (covers videos)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  },
});

module.exports = upload;
