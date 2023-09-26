const  express = require('express');
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")
//const multer = require('multer');
const path = require("path");

dotenv.config();

const createJobFolder = require('./utilities/createFolder');
const createJobID = require('./utilities/createJobID');
const createPipelineProcess = require('./utilities/pipelineManager');
//const pipelineConstruct = require('./utilities/pipelineConstruct');


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Map to store information about running video processes
const runningProcesses = [];

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

//only for debugging front end will be diffrent file
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "uploadTest.html"));
});

app.get("/debug", (req,res) => {
  console.log('logged');
  return res.json({status: 'success'});
});

//? maybe add middleware to check if file is too big and if files have
//  been supplied propely

//uploads and saves videos the 'jobs' folder to be processed by pipeline
app.post('/upload',
    fileUpload({createParentPath:true}),
    (req,res)=> {
      console.log(req);
      //get the files from the request
      const files = req.files
      console.log(files);
      console.log("####################");
      const key = Object.keys(files)[0];
      const uploadObject = files[key];
      
      console.log(uploadObject.md5);
      //create job id from md5 video hash and a salt to make it unique
      currentJobID = createJobID(uploadObject.md5);
      
      //create folder if not exist for the job
      createJobFolder(__dirname,currentJobID);

      //creat jobpath
      const jobPath = path.join('jobs',currentJobID)

      //write files to system for processing of the pipeline
      //create filepath for upload
      const filepath = path.join(__dirname, jobPath,uploadObject.name)
      
      uploadObject.mv(filepath,(err) => {
        if (err) return res.status(500).json({ status : "error", message: err})
      })
      console.log('upload succeeded and folder has been created')
      
      //after upload succeeded start pipeline processing
      // Spawn a child process to run the video processing pipeline
      createPipelineProcess(currentJobID,jobPath,filepath,runningProcesses);

      
      
      return res.json({status: 'success', message: uploadObject.name})

    }
);