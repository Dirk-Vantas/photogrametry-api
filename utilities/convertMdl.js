const obj2gltf = require("obj2gltf");
const fs = require("fs");

const convert2gltf = ((modelPath,modelName) => {

    const options = {
        binary: true,
      };
    
    //create correct path
    const path = `${modelPath}/${modelName}`;
    
    //start conversion on modelpath usually meshroomOutput 
    obj2gltf(path, options).then(function (glb) {
    fs.writeFileSync("model.glb", glb);
    });
});

module.exports = convert2gltf;