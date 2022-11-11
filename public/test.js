const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const moveFile = (file, dir2)=>{
  const f = path.basename(file);
  const dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const oldpath = files.filetoupload.filepath;
      const newpath=path.join(__dirname, "../")
      moveFile(oldpath, newpath,(err)=>{
        console.log(err)
      })
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8000,()=>{
    console.log("listning to port 8000")
});