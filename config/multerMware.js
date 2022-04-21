const path = require('path');
const multer = require('multer');

const FILE_PATH = path.join('/assets/images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', FILE_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload= multer({ 
    storage: storage,

    fileFilter: function (req, file, callback) {
    
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.avif' && ext !== '.webp' && ext !== '.jfif') {
        
            return callback(null, false);
        }
        callback(null, true)
    }
})

module.exports = { upload }