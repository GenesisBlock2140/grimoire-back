const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {

  if (!req.file) {
    return next();
  }

  const optimizedImgPath = path.join('images/optimized', req.file.filename.split('.')[0] + Date.now() + '.webp');

  sharp(req.file.path)
  .resize({ width: 500, height: 500, fit: 'inside' })
  .toFormat('webp')
  .webp({ quality: 80 })
  .toFile(optimizedImgPath, (err, info) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: "Erreur lors du traitement de l'image" });
    }

    // Supp l'img originale
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting original image:', unlinkErr);
      }

      // Maj path de l'img de la req
      req.file.path = optimizedImgPath;
      req.file.filename = path.basename(optimizedImgPath);

      next();
    });
  });

}