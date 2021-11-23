import express from 'express';
require('dotenv').config();
import connectDB from './config/db';
import routes from './routes/files';
import show from './routes/show';
import download from './routes/download';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// cors
const corsOption = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOption));

// template engine // work with render 
// set 'view engines' as 'ejs' // set path for 'views folder'
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// db
connectDB(process.env.MONGO_URL);

// to tell express - css present in public folder
app.use(express.static('public'));
// middleware to parse json data
app.use(express.json());

// middlewares, routes
app.use('/files',routes);
app.use('/files',show);
app.use('/files/download',download);

// server listening port
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
