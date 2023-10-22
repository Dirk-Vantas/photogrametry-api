//here the pipeline and process spawner and managing will take place
const { spawn } = require('child_process');
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

          switch (messageBody) {
            case 'ffmpeg done':
              runningProcesses[messageID]['pipeline'] = messageBody;
              runningProcesses[messageID]['progress'] = 20;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            case 'meshroom done':
              runningProcesses[messageID]['pipeline'] = messageBody;
              runningProcesses[messageID]['progress'] = 80;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            //this is the last step and job should be labeled as done after it
            case 'conversion done':
              runningProcesses[messageID]['pipeline'] = messageBody;  
              runningProcesses[messageID]['status'] = 'done';
              runningProcesses[messageID]['progress'] = 100;
              console.log(`message recieved :D : "${messageBody}"`);
              break;
            default:
              console.log(`Sorry, couldnt handle message: ${expr}.`);
          }
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