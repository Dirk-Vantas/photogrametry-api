//utility file to check the job folder and create folders for the uploads
const fs = require('fs');
const path = require('path');

//uses the salted md5 hash of the video as a jobID
const createJobFolder = (rootDir,jobID) => {
    // Generate the path to the 'jobs' directory
    const jobsDir = path.join(rootDir, 'jobs');

    // Create the folder with the MD5 hash as its name
    const folderPath = path.join(jobsDir, jobID);

    //create folder
    fs.mkdir(folderPath, (err) => {
        if (err) {
          if (err.code === 'EEXIST') {
            // If the folder already exists, log it
            console.log(`Folder with hash '${jobID}' already exists.`);
          } else {
            // If there's another error, log and throw it
            console.error(err);
            throw err;
          }
        } else {
          console.log(`Folder with hash '${jobID}' created.`);
        }
      });

};

module.exports = createJobFolder;
