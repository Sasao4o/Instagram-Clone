const multer = require("multer");
const path = require('path');
console.log(__filename);
console.log(__dirname);
console.log(path.dirname(require.main.filename))
console.log(require.main.filename)
console.log(process.cwd())
  // Multer Configuration 
  function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
    const storage = multer.diskStorage({
        destination:"./photos",
        filename:function (req, file, cb) { //Mutates filename property in req.file
        cb(null, file.fieldname +  "" + Date.now() + path.extname(file.originalname) );
        }
    });
    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
        checkFileType(file, cb)

        }
    }).single("myImage");
 
module.exports = upload;