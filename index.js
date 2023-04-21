const express = require('express');
const app = express();
const port = 3000;

// Routes
const user = require('./routes/user')

app.use(express.json());

app.get('/',(req,res)=>{
    return res.json({
        message : 'Success'
    });
})

app.use('/user', user);

app.listen(port, function(){
    console.log(`Listen TO The Port ${port}`);
})