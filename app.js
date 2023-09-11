const  express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });



app.get('/status', (request, response) => {
    const status = {
    'Status': 'Running'
    };
    
    response.send(status);
});