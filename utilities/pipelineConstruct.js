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

// Get the video file path from command-line arguments
const jobPath = process.argv[2];
const videoFilePath = process.argv[3];

//console.log(`jobPath: ${jobPath}, filepath:${videoFilePath}`);


//set correct cwd
process.chdir(jobPath);


//Define the ffmpeg command
const ffmpegCommand = 'ffmpeg';
const args = [
  '-i', path.basename(videoFilePath),  // Input video file path "basename gets the filename"
  '-vf', 'fps=10',         // Video filter to set frame rate (change as needed) "maybe make this user input"
  'frames/frame_%04d.png', // Output file pattern (change as needed)
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
  
// Spawn the ffmpeg process
const ffmpegProcess = spawn(ffmpegCommand,args);

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`Child Process stderr: ${data}`);
  });

// Optionally, listen for the ffmpeg process to finish
ffmpegProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Video processing completed successfully.');
  } else {
    console.error(`Video processing process exited with code ${code}`);
  }
});
