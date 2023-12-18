//here the pipeline and process spawner and managing will take place
const { spawn } = require('child_process');
const db = new sqlite3.Database('grametry.db');
//const createJobID = require('./createJobID');
//const pipelineConstruct = require('./utilities/pipelineConstruct');
//const pipelineConstruct = require('./pipelineConstruct');

const createPipelineProcess = (jobID,jobPath,filepath,runningProcesses) => {
    // jobID needed to identfy the spawned job later
    // filepath needed so the scripts can work in the correct folder space
    // runningPorcess is a map that is needed to keep track of started jobs and their asosiated pid

    // Spawn the video processing script with the video file path as an argument
    const videoProcessing = spawn('node', ['./utilities/pipelineConstruct.js', jobPath,filepath,jobID]);

    // Store information about the running process
    const processInfo = {
        childProcess: videoProcessing,
        startTime: new Date(),
      };

    // Add the process to the runningProcesses map using the video processing ID
    runningProcesses[jobID] = {
        jobID:jobID,
        status:"running",
        pipeline:"started",
        progress:0,
        startTime: new Date(),
    };

    //TODO implement these with the user job creation interface later 
    let kommentar = "large nuts"
    const currentDate = new Date();
    const userID = 1
    const progress = 0

    //insert new process into database
    db.run('INSERT INTO Auftraege (uniqueID, Kommentar, Date, BenutzerID,status,progress) VALUES (?, ?, ?, ?, ?, ?)', [jobID,kommentar,currentDate,userID,progress], function (err) {
      if (err) {
        //TODO implemene better exceptions
        return console.error(err.message);
      } else {
        res.status(200).send('User successfully made')
      }
    });
  

    // Define a function to update the running processes so that the async problems are
    // propely taken care of
    function updateRunningProcess(messageID, messageBody, callback) {
        runningProcesses[messageID]['pipeline'] = messageBody;
        console.log(`message received :D : "${messageBody}"`);
        callback(); // Call the callback to indicate that the update is complete
    }

    videoProcessing.stdout.on('data', (data) => {
        //get message from stout of childprocess for interprocess intercommunication
        //destructered stamenet
        //let debugString = String(data)
        //console.log(`handeled stdout : ${debugString}`)
        let [messageID,message,messageBody] = String(data).split(',');
        //console.log(`extracted sub strings  || ${messageID} || ${messageBody}`)
        
        if (message == 'message'){
        let newProgressValue;
          switch (messageBody) {
            case 'ffmpeg done':
              newProgressValue = 20
              runningProcesses[messageID]['pipeline'] = messageBody;
              runningProcesses[messageID]['progress'] = 20;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            case 'meshroom done':
              newProgressValue = 80
              runningProcesses[messageID]['pipeline'] = messageBody;
              runningProcesses[messageID]['progress'] = 80;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            //this is the last step and job should be labeled as done after it
            case 'conversion done':
              newProgressValue = 100
              runningProcesses[messageID]['pipeline'] = messageBody;  
              runningProcesses[messageID]['status'] = 'done';
              runningProcesses[messageID]['progress'] = 100;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            default:
              console.log(`Sorry, couldnt handle message: ${expr}.`);
          }
          db.run(`UPDATE Auftraege SET progress = ? WHERE jobID = ?`, 
                    [newProgressValue, messageID], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Row(s) updated: ${this.changes}`);
              });
        }
      });

      

      videoProcessing.stderr.on('data', (data) => {
        console.error(`pipeline stderr: ${data}`);
      });

      videoProcessing.on('close', (code) => {
        console.log(`pipeline exited with code ${code}`);
      });


}


module.exports = createPipelineProcess;