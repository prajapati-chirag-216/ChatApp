const genratemessage=(message)=>{
    return {
        username:message.username,
        text:message.msg,
        createdAt:new Date().getTime()
    }
}
const genrateLocationMessage=(locationmsg)=>{
    return {
        username:locationmsg.username,
        url:locationmsg.url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    genratemessage,
    genrateLocationMessage
}

// -----------------------------------------------------------------------------------------
// var fs = require('fs');
// var path = require('path');
// //moves the $file to $dir2
// var moveFile = (file, dir2)=>{
//     //include the fs, path modules
  
//     //gets file name and adds it to dir2
//     var f = path.basename(file);
//     var dest = path.resolve(dir2, f);
  
//     fs.rename(file, dest, (err)=>{
//       if(err) throw err;
//       else console.log('Successfully moved');
//     });
//   };
  
//   //move file1.htm from 'test/' to 'test/dir_1/'
//   const oldpath=path.join("C:/Users/Public/Pictures/my_1.jpeg")
//   const newpath=path.join(__dirname, "../")
//   moveFile(oldpath, newpath);
