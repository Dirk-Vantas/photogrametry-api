# Photogrammetry API

Node.js API for a photogrammetry service based on Meshroom photogrammetry by AliceVision.

## Required Libraries

- **Environment File**: Consider using a `.env` file to handle file paths.
- **Platform Support**: Currently, only the Windows version of libraries is supported.
- **Node.js**: Required to run the API.
- **FFmpeg**: Required for frame extraction from the videos.
- **Meshroom**: Meshroom-2023.2.0 is used for feature extraction, image matching, sparse cloud creation, and meshing.
- **MeshLab**: Used for post-processing of the mesh.

## Endpoints

- **"/"**: Provides a debug file upload interface.
- **"/upload"**: Allows you to upload video files and get an MD5 hash of the video file, which acts as a job ID.
- **"/status"**: Lists all queued jobs.
- **"/getModel"**: Retrieves the output of a specific job after it's finished, provided the MD5 hash of the video file is supplied.

## Pipeline
Uploaded videos will be saved in the '/jobs' folder to be processed by the pipeline.

## TODO:

- add quality setting to the upload endpoint so that  the quality of the model (number of frames used) can be tweaked
- add meshlab postprocessing
- add small database for running processes instead of storing them in memory

