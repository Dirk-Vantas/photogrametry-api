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

//utilities import
const createJobFolder = require('./utilities/createFolder');
const createJobID = require('./utilities/createJobID');
const createPipelineProcess = require('./utilities/pipelineManager');
const initializePassport = require('./config/passport-config.js')

//default config for express
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//server javascript files
app.use(express.static('public'));


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
        console.log(rows);
        return rows;
      } else {
        console.log(rows);
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
        console.log(rows);
        return rows;
      } else {
        console.log(rows);
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

    // uploadObject.mv(filepath, (err) => {
    //   if (err) return res.status(500).json({ status: "error", message: err })
    // })
    console.log('upload succeeded and folder has been created')

    //after upload succeeded start pipeline processing
    // Spawn a child process to run the video processing pipeline
    //createPipelineProcess(currentJobID, jobPath, filepath, userID);
    
    const kommentar = 'test'
    const currentDate = new Date();
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
    });
  
  

    //set correct repsonse headers to allow remote orgin to recive success message :)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return res.json({ status: 'success', message: uploadObject.name, hash: currentJobID })

  }
);

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

  //console.log(user.userID)

  db.all('select * from jobs where BenutzerID = ?',[user.ID], function (err,rows) {
    if (err){
      console.log(err.message)
    } else {
      if (rows.length >  0) {
        console.log(rows)
        res.status(200).send(rows)
      }
      else{
        console.log(rows)
        console.log('user has no jobs')
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
      if (rows.length > 0) {
        res.status(200).send(rows);
      } else {
        res.status(400).send('Couldnt get all User');
      }
    }
  });
});

app.delete('/users', (req, res) => {
  const id = req.query.id;

  db.run('DELETE FROM Benutzer WHERE ID = ?', [id], function (err, rows) {
    console.log(rows)
    if (err) {
      res.status(400).send('Delete from Usertable failed')
      return console.error(err.message);
    } else {
      res.status(200).send('Delete succeeded')
    }
  });
});

app.post('/logs', (req, res) => {
  const msg = req.query.msg
  const aufID = req.query.aID
  const llevel = req.query.llevel
  const lart = req.query.lart

  db.run('INSERT INTO Log (Logmessage, AufgabeID, Logtime, Loglevel, LogArt) VALUES (?, ?, ?, ?, ?)', [msg, Number(aufID), new Date().toLocaleString(), llevel, Number(lart)], function (err) {
    if (err) {
      res.status(400).send('Log couldnt be made')
      return console.error(err.message);
    } else {
      res.status(200).send('Log successfully made')
    }
  });
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

app.post('/login', passport.authenticate('local', {
  successRedirect: '/userdashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));


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
    db.run('INSERT INTO Benutzer (Benutzername, Passwort, userlevel) VALUES (?, ?, 1)', [username, hashedPassword], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('User could not be created');
      } else {
        console.log("User successfully created");
        res.redirect('/login');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/register');
  }
});

function checkifAdmin(req,res, next){
  if (req.user.userlevel == 0)
  {
    return next();
  }
  else{
    res.redirect('/userdashboard')
  }
}

function checkifUser(req,res, next){
  if (req.user.userlevel == 1)
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
  req.logOut(function(err) {
      if (err) { 
          return next(err); // or handle the error in a way that fits your app
      }
      res.redirect('/login'); // Redirect to the login page or another page
  });
})
