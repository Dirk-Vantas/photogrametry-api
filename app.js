//import { User, Job, Log } from "./Entity.js";
//import { SqlDatabase } from 'sqlite3orm';

//package imports
const express = require('express');
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")
const path = require("path");
var cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// (async () => {
//   let sqldb = new SqlDatabase();

//   await sqldb.open('file:sqlite3orm?mode=memory&cache=shared');

//   var userDAO = new BaseDAO(User, sqldb);
//   var jobDAO = new BaseDAO(Job, sqldb);
//   var logDAO = new BaseDAO(Log, sqldb);


// })();

//utilities import
const createJobFolder = require('./utilities/createFolder');
const createJobID = require('./utilities/createJobID');
const createPipelineProcess = require('./utilities/pipelineManager');
const initializePassport = require('./config/passport-config.js')
const logger = require('./utilities/logger.js');
const createLog = require('./utilities/logger.js');

//default config for express
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//server javascript files
app.use(express.static('public'));
app.use(express.static('src'))


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

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

// Open a database connection (or create a new one if it doesn't exist)
const db = new sqlite3.Database('grametry.db');

dotenv.config();

initializePassport(
  passport,
  async (username) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM Benutzer WHERE Benutzername = ?', [username], function (err, rows) {
          if (err) {
            return reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      // Check if rows have data and handle accordingly
      if (rows.length > 0) {
        //console.log(rows);
        return rows;
      } else {
        //console.log(rows);
        return null;
      }
    } catch (err) {
      console.error(err.message);
      // Handle the error as needed
    }

  },
  async (id) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM Benutzer WHERE ID = ?', [id], function (err, rows) {
          if (err) {
            return reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      // Check if rows have data and handle accordingly
      if (rows.length > 0) {
        //console.log(rows);
        return rows;
      } else {
        //console.log(rows);
        return null;
      }
    } catch (err) {
      console.error(err.message);
      // Handle the error as needed
    }
  },
);


// ULTRA LEGACY CODE REMOVE AS SOON AS THIS BITCH RUNS //
// Map to store information about running video processes
var runningProcesses = [];

runningProcesses['testEntry'] = {
  jobID: 'randomJobID',
  process: 'testProcess',
  status: "running",
  pipeline: "started",
  startTime: new Date(),
};

//set viewengine
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false}))
//passport
app.use(flash())
app.use(session({
  secret : 'supersecret',
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

//uploads and saves videos the 'jobs' folder to be processed by pipeline
app.post('/upload',
fileUpload({ createParentPath: true }),
  (req, res) => {
    console.log(req);
    //get the files from the request
    const files = req.files

    //get the user that is currently logged in
    const user = req.user
    const userID = user.ID

    const key = Object.keys(files)[0];
    const uploadObject = files[key];

    //verify if it is indeed a mp4 uploaded
    


    console.log(uploadObject.md5);
    //create job id from md5 video hash and a salt to make it unique
    currentJobID = createJobID(uploadObject.md5);

    //create folder if not exist for the job
    createJobFolder(__dirname, currentJobID);

    //creat jobpath
    const jobPath = path.join('jobs', currentJobID)

    //write files to system for processing of the pipeline
    //create filepath for upload
    const filepath = path.join(__dirname, jobPath, uploadObject.name)

    uploadObject.mv(filepath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err })
    })
    //verify if it is indeed a mp4 uploaded
    ffmpeg.ffprobe(filepath, function(err, metadata) {
      if (err) {
          fs.unlinkSync(filepath); // Delete the file
          console.log('video file invalid')
          createLog(db,'invalid video file uploaded',currentJobID,0,2)
          res.status(400).send('invalid video file uploaded');
      
        } else {
          ffmpeg.ffprobe(filepath,  function (err, info) {
            if (err){
              return done(err);
            } 
            if (info["streams"][0]["codec_type"] != 'video'){
              console.log('video file invalid')
              createLog(db,'invalid video file uploaded',currentJobID,0,2)
              fs.unlinkSync(filepath); // Delete the file
              res.status(400).send('invalid video file uploaded');
            }
            else {
              
              console.log('mp4 is valid');
              console.log('upload succeeded and folder has been created')
              createLog(db,'upload and validation succeeded and folder has been created',currentJobID,0,4)

              //after upload succeeded start pipeline processing
              // Spawn a child process to run the video processing pipeline
              //createPipelineProcess(currentJobID, jobPath, filepath, userID);

              const kommentar = 'video file upload'
              const currentDate = new Date().toLocaleString();
              const progress = 0
              const status = "started"
              //insert new process into database
              // Now insert into database here
              //?stopped working for some reason
              db.run('INSERT INTO jobs (uniqueID, Kommentar, Date, BenutzerID, Status, Progress) VALUES (?, ?, ?, ?, ?, ?)',
              [currentJobID, kommentar, currentDate, userID, status, progress], function (dbErr) {
                if (dbErr) {
                  console.error(dbErr.message);
                  //return res.status(500).send('Error inserting job into database');
                } else {
                  console.log("Job successfully created");
                  // Send response here after successful database insertion
                  //res.json({ status: 'success', message: "Job created", jobID: currentJobID });

                }
                //create log if user uploads new job
                createLog(db,'new job was created',currentJobID,0,4)
              });



              //set correct repsonse headers to allow remote orgin to recive success message :)
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

              return res.json({ status: 'success', message: uploadObject.name, hash: currentJobID })

              
            }
          });
        }
    });
  });

app.get('/status/:hashParam?', (req, res) => {

  //set correct repsonse headers to allow remote orgin to recive success message :)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  if (req.params.hashParam) {
    res.json(Object.values(runningProcesses[req.params.hashParam]));
    db.get(`SELECT * FROM Auftreage WHERE jobID = ?`, [hashParam], (err, row) => {
      if (err) {
          return console.error(err.message);
      }
      // Convert the array of rows into a dictionary
      if (row) {
        // Creating a new dictionary
        let rowDict = {};

        // Looping over each key in the row
        for (let key in row) {
            if (row.hasOwnProperty(key)) {
                rowDict[key] = row[key];
            }
        }}
        res.json(rowDict)

  });

  }
  else {
    res.json({error: "no hash parameter defined :("});
  }
});

// Define an endpoint that takes a hash (object) as a parameter
app.get('/getModel/:hashParam', (req, res) => {
  // Retrieve the hash parameter from the URL
  // if no parameter given send error
  if (!req.params.hashParam) {
    res.status(400).send('Bad Request: no job hash given');
  }
  const hashParam = req.params.hashParam;
  //check if specified job is done
  if (!runningProcesses[hashParam]['status'] === 'done') {
    res.status(400).send('Bad Request: job is not done wait');
  }
  //serve path to model
  const modelPath = `jobs/${hashParam}/model.glb`;

  //set correct repsonse headers to allow remote orgin to recive success message :)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json({ status: 'success', modelPath: modelPath })

});

app.get('/jobs', (req, res) => {
  const user = req.user

  if (user == null){
    console.log('no authenticated user was found while making this request')
    return
  }
  //console.log(user.userID)
  //if user is admin give all jobs
  if (user.userlevel == 1) {
    db.all('select * from jobs',[], function (err,rows) {
      if (err){
        console.log(err.message)
      } else {
        if (rows.length >  0) {
          //console.log(rows)
          res.status(200).send(rows)
        }
        else{
          //console.log(rows)
          console.log(' no jobs')
        }
      }
    });
  } else {
  // if user is normal user just give him his jobs
  db.all('select * from jobs where BenutzerID = ?',[user.ID], function (err,rows) {
    if (err){
      console.log(err.message)
    } else {
      if (rows.length >  0) {
        //console.log(rows)
        res.status(200).send(rows)
      }
      else{
        //console.log(rows)
        console.log('user has no jobs')
      }
    }
  });
  }


});


app.get('/users', (req, res) => {
  db.all('SELECT * FROM Benutzer where userlevel = ?', [0], function (err, rows) {
    if (err) {
      res.status(400).send('Couldnt select users')
      return console.error(err.message);
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows);
      } else {
        res.status(400).send('Couldnt get all User');
      }
    }
  });
});

app.post('/delete/job', (req, res) => {
  const id = req.query.id;
  const user = req.user
  //check if admin is doing the request
  if (user.userlevel == 1){
      db.run('DELETE FROM jobs WHERE uniqueID = ?', [req.body.job], function (err, rows) {
        //console.log(rows)
        if (err) {
          res.status(400).send('Delete from jobs table failed')
          createLog(db,'job deletion failed',req.body.job,0,2)
          return console.error(err.message);
        } else {
          res.status(200).send('Deletetion of job succeeded')
          createLog(db,'job deletion succeded',req.body.job,0,4)
        }
      });
  }
});

app.post('/delete/user', (req, res) => {
  console.log('deletion started')
  const id = req.query.id;
  const user = req.user
  //check if admin is doing the request
  if (user.userlevel == 1){
      db.run('DELETE FROM Benutzer WHERE ID = ?', [req.body.user], function (err, rows) {
        //console.log(rows)
        if (err) {
          console.log('Delete from user table failed')
          createLog(db,'user deletion failed',req.body.job,0,2)
          return console.error(err.message);
        } else {
          
          console.log('Deletetion of user succeeded')
          createLog(db,'user deletion succeded',req.body.job,0,4)
        }
      });
  }
});



app.get('/logs', (req, res) => {
  db.all('SELECT * FROM Log', [], function (err, rows) {
    if (err) {
      res.status(400).send('Log couldnt be made')
      return console.error(err.message);
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows);
      } else {
        res.status(400).send('Couldnt get Logs');
      }
    }
  });
});

//only usefull if we add a serch function
app.get('/log', (req, res) => {
  const id = req.query.id
  db.all('SELECT * FROM Log where ID = ?', [id], function (err, rows) {
    if (err) {
      res.status(400).send('Log couldnt be made')
      return console.error(err.message);
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows);
      } else {
        res.status(400).send('Couldnt get Logs');
      }
    }
  });
});

//this should not be an option
app.delete('/logs', (req, res) => {
  const ID = req.query.id

  db.run('DELETE FROM Log WHERE ID = ?', [ID], function (err) {
    if (err) {
      res.status(400).send('Delete from Logtable failed');
      return console.error(err.message);
    } else {
      res.status(200).send('Delete succeeded');
    }
  });
});

//userlogin views with ejs

//login page
app.get("/login", checkNotAuthenticated,(req, res) => {
  res.render('login.ejs');
  console.log('site has been accessed')
});

//redirect users correctly
app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }

  const user = req.user
  switch(user.userlevel) {
    case 1:
      res.redirect('/admindashboard');
      break;
    case 0:
      res.redirect('/userdashboard');
      break;

    default:
      console.log("I don't know that fruit.");
    }
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      // Log the error
      console.error("Authentication Error: ", err);
      
      return next(err);
    }
    if (!user) {
      // Log the failed login attempt
      console.log("Login failed for user:", req.body.username);
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        // Log the error
        console.error("Login Error: ", err);
        return next(err);
      }
      // Log successful login
      console.log("Login successful for user:", user.Benutzername);
      createLog(db,`login of user ${user.Benutzername}`,user.ID,0,4)
      // Redirect to the success page
      return res.redirect('/');
    });
  })(req, res, next);
});



//userdashboard
app.get("/userdashboard", checkAuthenticated,checkifUser,(req, res) => {
  res.render('userdashboard.ejs', {userOBJ: req.user});
  console.log('site has been accessed')
});
//admindashboard
app.get("/admindashboard", checkAuthenticated,checkifAdmin,(req, res) => {
  res.render('admindashboard.ejs');
  console.log('site has been accessed')
});
//register page
app.get("/register", checkNotAuthenticated,(req, res) => {
  res.render('register.ejs');
  console.log('register site has been accessed')
});

//handle user register
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password1;
  const password2 = req.body.password2;

  //todo validate userinput
  // Validation of same passwords
  if ((password == password2) && username && password) {
    console.log('usercreation initialized')
  }
  else{
    return res.status(400).send('Invalid input');
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    db.run('INSERT INTO Benutzer (Benutzername, Passwort, userlevel) VALUES (?, ?, 0)', [username, hashedPassword], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('User could not be created');
      } else {
        console.log("User successfully created");
        createLog(db,`user  ${username} succesfully created`,'nan',0,4)
        res.redirect('/login');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/register');
  }
});

function checkifAdmin(req,res, next){
  if (req.user.userlevel == 1)
  {
    return next();
  }
  else{
    res.redirect('/userdashboard')
  }
}

function checkifUser(req,res, next){
  if (req.user.userlevel == 0)
  {
    return next();
  }
  else{
    res.redirect('/admindashboard')
  }
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/userdashboard')
  }
  next()
}

app.post('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user
    req.logOut(function(err) {
        if (err) {
            return next(err); // or handle the error in a way that fits your app
        }
        createLog(db,`user  ${user.Benutzername} logged out`,user.ID,0,4)
        res.redirect('/login'); // Redirect to the login page or another page
    });
  }
  
})
