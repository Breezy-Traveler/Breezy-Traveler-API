var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var mongoose = require('mongoose');
var grid = require('gridfs-stream');
var fs = require('fs');

const Schema = mongoose.Schema;
const UserProfileImageSchema = Schema({
  payload: Schema.Types.Mixed, //image is stored here
  type: String
});

//const PImage = mongoose.model('UserProfileImage', UserProfileImageSchema)
router.post('/image-multipart', (req, res, next) => {
  var form = new formidable.IncomingForm();

  form.uploadDir = "/data";
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!err) {
      //console.log('File uploaded : ' + files.file.path);
      grid.mongo = mongoose.mongo;
      var conn = mongoose.createConnection('..mongo connection string..');
      conn.once('open', function () {
        var gfs = grid(conn.db);
        var writestream = gfs.createWriteStream({
          filename: files.file.name
        });
        fs.createReadStream(files.file.path).pipe(writestream);
      });
    }
  });
  form.on('end', function () {
    res.send('Completed ..... go and check fs.files & fs.chunks in  mongodb');
  });
})

module.exports = router
