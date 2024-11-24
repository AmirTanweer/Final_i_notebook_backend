
const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')
const authen = require('./routes/auth')
const notes = require('./routes/notes')
    
connectToMongo();
const app = express() 
const port = process.env.PORT || 5000;
//middleware for cors  
app.use(cors()); 
      
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello hi am amir')
    console.log(req.body); 
})
 
//Available Routes  
app.use('/api/auth', authen)
app.use('/api/notes',notes)
 
       
app.listen(port, () => {
    console.log(`Listening on port${port}`)
})   