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
        process:videoProcessing,
        status:"running",
        pipeline:"started",
        startTime: new Date(),
    };

    console.log(runningProcesses);
    
    videoProcessing.stdout.on('data', (data) => {
        console.log(`Child Process stdout: ${data}`);
        //get message from stout of childprocess for interprocess intercommunication
        var messageID = String(data).split(',')[0];
        var message = String(data).split(',')[1];
        var messageBody = String(data).split(',')[2];
        
        if (message == 'message'){
          if(messageBody == 'meshroom done'){
            console.log(`message recieved :D : ${messageBody}`);
            runningProcesses[messageID]['pipeline'] = messageBody;
            console.log(runningProcesses);
          }
          else{
            console.log(`message recieved :D : ${messageBody}`);
            runningProcesses[messageID]['pipeline'] = messageBody;
            console.log(runningProcesses);
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