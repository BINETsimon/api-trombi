const multer = require('multer');

let fileIndex = 0;
const allowedFileTypes = ['image/jpeg', 'image/png'];

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${req.user.email}`);
  },
  filename: (req, file, cb) => {
    fileIndex++;
    cb(null, `${Date.now()}${fileIndex}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

// Create the multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }
}).array('files');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ message: 'The file size is too big' });
    } else if (err) {
      return res.status(500).send({ message: 'Type de fichier non autorisé' });
    }
    // Aucune erreur, continuer
    next();
  });
};

module.exports = uploadMiddleware;
