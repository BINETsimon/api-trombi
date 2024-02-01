const fs = require('fs').promises;
const sharp = require('sharp');
const sizeOf = require('image-size');

const db = require('../models');

const Picture = db.pictures;

exports.uploadFile = async (req, res) => {
  const inputImagePath = req.file.destination + '/' + req.file.filename;

  try {
    const dimensions = sizeOf(inputImagePath);

    const compressionOptions = {
      quality: 80,
      width: dimensions.width < 400 ? dimensions.width : 400,
      height: dimensions.height < 500 ? dimensions.width : 500,
    };

    // Lire le fichier source
    const inputImageBuffer = await fs.readFile(inputImagePath);

    // Utiliser sharp pour effectuer la compression
    const compressedBuffer = await sharp(inputImageBuffer)
      .resize({ width: compressionOptions.width, height: compressionOptions.height, fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: compressionOptions.quality })
      .toBuffer();

    // Écrire les données compressées dans le même fichier source

    await fs.writeFile(inputImagePath, compressedBuffer);

    const pictureAttributes = req.fileInfo.split('_');

    const pictureBody = {
      picture_url: req.file.filename,
      first_name: pictureAttributes[1],
      last_name: pictureAttributes[0],
      label: pictureAttributes[2],
      userId: req.user.id,
    };

    const picture = await Picture.create(pictureBody);
    res.json({
      file: picture 
    });
  } catch (err) {
    console.error(err);
    
    res.status(500).json({ message: 'Error uploading and compressing the image' });
  }
};

// Retrieve all USER from the database.
exports.findAll = async (req, res) => {
  const user = req.user;
  Picture.findAll({where: {userId: user.id}}).then((data) => {
    res.send(data);
  });
  // const folderName = `uploads/${user.email}`;
  // console.log(folderName);
  // res.send({fileNames : await fs.readdir(folderName)});
};

exports.findOne = (req, res) => {
  const user = req.user;
  const folderName = `uploads/${user.email}`;
  const fileName = req.params.fileName;
  
  res.sendFile(fileName, {
    root: folderName
  }, function (err) {
    if (err) {
      res.send({ message: `Votre image: ${fileName} n'existe pas` });
    }
  });
};


exports.updateFile = async (req, res) => {
  const file = req.body;
  
  Picture.update({
    first_name: file.first_name,
    last_name: file.last_name,
    label: file.label,
  }, {
    where: {id: file.id}
  }).then((result) => {
    if ([result] == 1) {
      res.send({ 
        message: 'Files renamed successfully!',
      });
    }else {
      res.status(404).json({ 
        message: 'Your picture does not exist',
      });
    }
  }).catch(err => {
    res.status(500).json({ 
      message: err,
    });
  });
};

exports.delete = (req, res) => {
  const user = req.user;
  const folderName = `uploads/${user.email}`;
  const fileName = req.params.fileName;

  Picture.destroy(
    {where: {picture_url: fileName}}
  ).then(res => {
    fs.unlinkSync(`${folderName}/${fileName}`);
    res.send({ 
      message: 'File deleted successfully!',
    });
  }).catch(err => {
    if(err)
      fs.unlinkSync(`${folderName}/${fileName}`);
    res.send({ 
      message: 'File deleted successfully!',
    });
  });
};

exports.delete = async (req, res) => {
  const user = req.user;
  const folderName = `uploads/${user.email}`;
  const fileName = req.params.fileName;

  try {
    const deletedPictureCount = await Picture.destroy({where: {picture_url: fileName}});

    // Vérifiez si une image a été supprimée
    if (deletedPictureCount === 1) {
      await fs.unlink(`${folderName}/${fileName}`);
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting picture:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};