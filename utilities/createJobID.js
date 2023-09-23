//module that takes the md5 of the uploaded video and creats a unique jobID
const crypto = require('crypto');

const createJobID = (md5Hash) => {
    const length = 10; 
    
    // Generate a random string
    const randomString = Math.random().toString(36).substring(2, length +2);
  
    // Create a hash object for SHA-256
    const sha256Hash = crypto.createHash('sha256');
    // Update the SHA-256 hash object with the random string
    sha256Hash.update(randomString);
    // Generate the SHA-256 hash in hexadecimal format
    const sha256RandomHash = sha256Hash.digest('hex');
  
    const inputMD5 = crypto.createHash('sha256');
    // Update the MD5 hash object with input md5 hash
    inputMD5.update(md5Hash);
    // Generate the MD5 hash in hexadecimal format
    const md5HashHex = inputMD5.digest('hex');
  
    // Append the MD5 hash to the SHA-256 hash
    const finalHash = sha256RandomHash + md5HashHex;
  
    return finalHash;
  };

  module.exports = createJobID;