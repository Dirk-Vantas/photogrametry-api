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
        //process:videoProcessing,
        status:"running",
        pipeline:"started",
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
        let debugString = String(data)
        console.log(`handeled stdout : ${debugString}`)
        let [messageID,message,messageBody] = String(data).split(',');
        console.log(`extracted sub strings  || ${messageID} || ${messageBody}`)
        
        if (message == 'message'){

            

            runningProcesses[messageID]['pipeline'] = messageBody;
            console.log(`message recieved :D : "${messageBody}"`);
            //console.log(runningProcesses);

            // updateRunningProcess(messageID,messageBody, () => {
            //     console.log('######## updated pushed ##########')
            // })
            

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