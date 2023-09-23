const  express = require('express');
const fileUpload = require("express-fileupload");
const multer = require('multer');
const path = require("path");
const app = express();

const { exec } = require('child_process');
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

//only for debugging front end will be diffrent file
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "uploadTest.html"));
});

app.post('/upload',
    fileUpload({createParentPath:true}),
    (req,res)=> {
      const files = req.files
      console.log(files)

      return res.json({status: 'logged', message: 'logged'})

    }
);