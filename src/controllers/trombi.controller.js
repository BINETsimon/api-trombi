const fs = require('fs');

exports.uploadFile = (req, res) => {
  res.json({ message: 'File uploaded successfully!' });
};

// Retrieve all USER from the database.
exports.findAll = (req, res) => {
  const user = req.user;
  const folderName = `uploads/${user.email}`;
  
  res.send({fileNames : fs.readdirSync(folderName)});
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

exports.updateFile = (req, res) => {
  const fileNames = req.body.fileNames;
  
  const user = req.user;
  const folderName = `uploads/${user.email}`;
  
  const files = fs.readdirSync(folderName); 
  
  try {
    fileNames.forEach(fileName => {

      const fileToChange = files.filter(item => item.startsWith(fileName.split('-')[0]+'-'))[0];
      
      if(fileToChange){

        fs.rename(`${folderName}/${fileToChange}`, `${folderName}/${fileName}`, () => { 
          console.log('file ' + fileToChange + 'renamed');  
        });
      }
    });
  } catch (err) {
    res.send({ message: err.message });
  }

  res.send({ 
    message: 'Files renamed successfully!',
    fileNames : fs.readdirSync(folderName)
  });
};