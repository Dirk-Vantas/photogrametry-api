const obj2gltf = require("obj2gltf");
const fs = require("fs");

const convert2gltf = ((rootDir,jobID) => {

    const options = {
        binary: true,
      };
    
    //create correct path
    const jobsDir = path.join(rootDir, 'jobs');
    
    
    obj2gltf("model.obj", options).then(function (glb) {
    fs.writeFileSync("model.glb", glb);
    });



};




module.exports = convert2gltf;