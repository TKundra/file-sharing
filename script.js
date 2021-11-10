import connectDB from "./config/db";
import File from "./models/files";
import fs from 'fs';
require('dotenv').config();

connectDB(process.env.MONGO_URL);

async function fetchData() {
    const pastDate = new Date(Date.now() - 24*60*60*1000); // in milliseceonds and convert it in date
    const files = await File.find({createdAt: {$lt: pastDate} }); // list of files
    if (files.length){
        for (const file of files){
            try {
                fs.unlinkSync(file.path); // delete from storage i.e uploads/
                await file.remove(); // delete from db
                console.log(`successfully deleted ${file.fileName}`);
            } catch (error) {
                console.log(`error while deleting file ${error}`);
            }
        }
    }
}

// exit the process when function done the job
fetchData().then(()=>{
    process.exit;
});