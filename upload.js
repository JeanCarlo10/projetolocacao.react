const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Caminho da pasta de upload
const uploadPath = path.join(__dirname, 'uploads');

// Cria a pasta uploads se não existir
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // garante a criação mesmo com subpastas
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;