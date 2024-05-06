const multer = require('multer')
const path = require('node:path')


const storage = multer.diskStorage({
    destination: function (req, file ,cb){
        cb(null, path.join(__dirname,"../public/assets/img/uploads"));
    },
    filename : function (req, file ,cb){
        const uniqueSuffic = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffic + path.extname(file.originalname))
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
      }
})


const upload = multer({storage})

module.exports = upload