# photogramatry-api
Node.js API for a photgramatry service based on meshroom photogrametry by alicevision

reuqired libraries:

considering a .env file to handle filepaths
right now only windows version of liraries supported

node.js to run api
ffmpeg || for frameextraction from the videos
meshroom || Meshroom-2023.2.0 to run feature extraction, imagematching, sparce cloud creation and meshing
meshlab || for post processing of the mesh 

Endpoints:

"/"           to get debug fileupload interface
"/upload"     to uploade video files and get md5 has of video file that acts as a job id 
"/listJobs"   to list all queued jobs
"/listJob"    to list speciefic job, needs a job id that is created by the fileuplad "md 5 hash of video file maybe?"
"/getOutput"  get output of specific job after its finished provided the md5 hash of video file is supplied

pipeline:
uploaded videos will be saved in the '/jobs' folder to be processes by the pipeline

