import mongoose from 'mongoose';

// db connections
function connectDB(url){
    mongoose.connect(url);
    const connection = mongoose.connection;
    connection.once('open', () => { // if successfuly
        console.log('database connected');
    });
    connection.on("error", ()=>{
        console.log("error");
    })
}

export default connectDB;