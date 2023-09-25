//here the pipeline will be modeled.
//this file acts a s a construct for the manager to call upon
//the whole pipline is as follows:
//ffmpeg -> extract frames
//meshroom -> extract feature data and mesh
//meshlab -> postprocess mesh
//imagemagick -> postprocess texture
const { spawn } = require('child_process');
const fs = require('fs');
const { pipeline } = require('stream');
const path = require("path");
require('dotenv').config()

// Get the video file path from command-line arguments
const jobPath = process.argv[2];
const videoFilePath = process.argv[3];
const jobID = process.argv[4];

//console.log(`jobPath: ${jobPath}, filepath:${videoFilePath}`);


//set correct cwd
process.chdir(jobPath);


// //Define the ffmpeg command
const ffmpegCommand = 'ffmpeg';
const ffmpegArgs = [
  '-i', path.basename(videoFilePath),  // Input video file path "basename gets the filename"
  '-vf', 'fps=10',         // Video filter to set frame rate (change as needed) "maybe make this user input"
  'frames/frame_%04d.png', // Output file pattern (change as needed)
];

//meshroom args
const meshroomArgs = [
    '--input',
    'frames',
    '--output ',
    'meshroomOutput',
];

//create folder for frames
fs.mkdir('frames', (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        // If the folder already exists, log it
        console.log(`Folder frames already exists.`);
      } else {
        // If there's another error, log and throw it
        console.error(err);
        throw err;
      }
    } else {
      console.log(`frames folder created`);
    }
  });

//create folder for mesh output
fs.mkdir('meshroomOutput', (err) => {
if (err) {
    if (err.code === 'EEXIST') {
    // If the folder already exists, log it
    console.log(`Folder frames already exists.`);
    } else {
    // If there's another error, log and throw it
    console.error(err);
    throw err;
    }
} else {
    console.log(`meshroom folder created`);
}
});

// Spawn the ffmpeg process
const ffmpegProcess = spawn(ffmpegCommand,ffmpegArgs);

// //error reporting to the main console
ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`);
  });

//when ffmpeg supprocess has finished send message to pipeline manager to update status dictionary
ffmpegProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Video processing completed successfully.');
    //send message to parent process about status of pipeline
    process.stdout.write(`${jobID},message,ffmpeg done`);
    process.stdout.write('starting meshroom process');
    //meshroom feature matching and reconstruction
    meshroomProcess();
    
  } else {
    console.error(`ffmpeg processing process exited with code ${code}`);
  }
});

function meshroomProcess(){
    const meshroomProcess = spawn(process.env.MESHROOM,meshroomArgs);
    meshroomProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Video processing completed successfully.');
          //send message to parent process about status of pipeline
          process.stdout.write(`${jobID},message,meshroom done`);
          
        } else {
          console.error(`meshroom processing process exited with code ${code}`);
        }
      });
    
    meshroomProcess.stderr.on('data', (data) => {
        console.error(`meshroom Process stderr: ${data}`);
        //process.stdout.write(`meshroom Process stderr: ${data}`);
    });
    
    meshroomProcess.stdout.on('data', (data) => {
        console.log(`meshroom Process stdout: ${data}`);
    });
}



