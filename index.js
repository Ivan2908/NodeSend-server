const express = require('express');
const connectDB = require('./config/db');

// Create the server instance
const app = express();

//ConnectDB
connectDB();

//Enable read value of the body
app.use( express.json() );

//Port for the app
const port = process.env.PORT || 4000;

//Routes of the app
app.use('/api/user', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/link', require('./routes/link'));


//Run the app
app.listen(port, '0.0.0.0', () => {
    console.log(`The server is working on the port ${port}`);
});