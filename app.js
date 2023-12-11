const  express = require('express');
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")
//const multer = require('multer');
const path = require("path");
var cors = require('cors');

const sqlite3 = require('sqlite3').verbose();

// Open a database connection (or create a new one if it doesn't exist)
const db = new sqlite3.Database('grametry.db');

dotenv.config();

const createJobFolder = require('./utilities/createFolder');
const createJobID = require('./utilities/createJobID');
const createPipelineProcess = require('./utilities/pipelineManager');
//const pipelineConstruct = require('./utilities/pipelineConstruct');


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// Map to store information about running video processes
var runningProcesses = [];

runningProcesses['testEntry'] = {
  jobID:'randomJobID',
  process:'testProcess',
  status:"running",
  pipeline:"started",
  startTime: new Date(),
};

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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
      
      //set correct repsonse headers to allow remote orgin to recive success message :)
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      
      return res.json({status: 'success', message: uploadObject.name, hash: currentJobID})

    }
);

app.get('/status/:hashParam?', (req, res) => {
  
  //set correct repsonse headers to allow remote orgin to recive success message :)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
  if (req.params.hashParam){
    res.json(Object.values(runningProcesses[req.params.hashParam])); 
  }
  else{
    res.json(Object.values(runningProcesses)); 
  } 
});

// Define an endpoint that takes a hash (object) as a parameter
app.get('/getModel/:hashParam', (req, res) => {
  // Retrieve the hash parameter from the URL
  // if no parameter given send error
  if (!req.params.hashParam){
    res.status(400).send('Bad Request: no job hash given');
  }
  const hashParam = req.params.hashParam;
  //check if specified job is done
  if (!runningProcesses[hashParam]['status']=== 'done'){
    res.status(400).send('Bad Request: job is not done wait');
  }
  //serve path to model
  const modelPath = `jobs/${hashParam}/model.glb`;

  //set correct repsonse headers to allow remote orgin to recive success message :)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json({status: 'success', modelPath : modelPath})
  
});

app.post('/register', (req, res) => {

  const username = req.query.usrnam;
  const password = req.query.pwd;

  db.run('INSERT INTO Benutzer (Benutzername, Passwort, userlevel) VALUES (?, ?, 1)', [username, password], function(err) {
    if (err) {
      res.status(400).send('User couldnt be made')
      return console.error(err.message);
    } else {
      res.status(200).send('User successfully made')
    }
  });
});

app.get('/login', (req, res) => {
  const id = req.query.id;

  db.all('SELECT benutzername FROM Benutzer WHERE ID = ?', [id], function(err, rows) {
    if (err) {
      res.status(400).send('DB Request failed');
      return console.error(err.message);
    } else {
      if (rows.length > 0) {
        res.status(200).send('true');
      } else {
        res.status(400).send('false');
      }
    }
  });
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM Benutzer', [], function (err, rows) {
    if (err) {
      res.status(400).send('Couldnt select users')
      return console.error(err.message);
    } else {
      res.status(200).send(rows)
    }
  });
});

app.delete('/users', (req, res) => {
  const id = req.query.id;

  db.run('DELETE FROM Benutzer WHERE ID = ?', [id], function(err, rows) {
    console.log(rows)
    if (err) {
      res.status(400).send('Delete from Usertable failed')
      return console.error(err.message);
    } else {
      res.status(200).send('Delete succeeded')
    }
  });
});

app.post('/log', (req, res) => {
  const msg = req.query.msg
  const aufID = req.query.aID

  db.run('INSERT INTO Log (Logmessage, AufgabeID, Logtime, Loglevel, LogArt) VALUES (?, ?, ?, ?, ?)', [msg, aID], function(err) {
    if (err) {
      res.status(400).send('User couldnt be made')
      return console.error(err.message);
    } else {
      res.status(200).send('User successfully made')
    }
  });
});

app.get('/log', (req, res) => {

});

app.delete('/log', (req, res) => {

});