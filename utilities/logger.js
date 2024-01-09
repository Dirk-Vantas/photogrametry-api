

function createLog(db,message,AufgabeID,loglevel,logart){

    const lart = logart;
    const msg = message;
    const jobID = AufgabeID;
    const llevel = loglevel;

    db.run('INSERT INTO Log (Logmessage, AufgabeID, Logtime, Loglevel, LogArt) VALUES (?, ?, ?, ?, ?)', 
    [msg, jobID, new Date().toLocaleString(), llevel, Number(lart)], function (err) {
        if (err) {
          //res.status(400).send('Log couldnt be made')
        console.error(err.message);
        console.log('Log couldnt be made')
        } else {
          console.log('created log')
        }
      });
}

module.exports = createLog