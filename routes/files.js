import express from 'express';
const router = express.Router();
import multer from 'multer'; // use to store files
import path from 'path';
import File from '../models/files';
import {v4 as uuid4} from 'uuid';
import sendMail from '../services/mail_service';
import template from '../services/emailTemplate';

// save files coming from client side to uploads/ folder at server side
let storage = multer.diskStorage({
    destination: (req, file, callback) => 
        callback(null, 'uploads/'), // (err, destination to store)
    filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`; // extname - extension name
        callback(null, uniqueName); // (err, unique name of file)
    }
})

// single file and max size of file
let upload = multer({
    storage: storage,
    limits: {fileSize: 100*1000000} // number in bytes so 100MB = 100*1000000
}).single('myfile') // for single file ('name attribute that we passing from client side)
 
router.post('/', (req, res) => {

    // store file
    upload(req, res, async (err)=>{
        // validate request
        if (!req.file){
            return res.json({msg: "files are required"});
        }
        // if error
        if(err){
            return res.status(500).send({error: err.message});
        }
        // store to db
        const file = File({
            fileName: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save(); // save to db
        // return redirect to save/download page
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`}); // response -> download link i.e http://localhost:3000/files/43545fvhqf6-fdhbvdyhg7a
    });

});

// send email
router.post('/send', async (req, res) => {
    const {uuid, emailTo, emailFrom, subject, name} = req.body;
    // validate
    if (!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: "all fields are required"});
    }
    try {
        // get data from db
        const file = await File.findOne({uuid: uuid});
        if (file.sender){ // if sender avaiable in db - don't allow to send again
            return res.status(422).send({error: "email already sent"});
        }
        // else store data
        file.sender = emailFrom;
        file.receiver = emailTo;

        // send email
        await sendMail({
            from: emailFrom,
            to: emailTo,
            name: name,
            subject: subject,
            text: `${emailFrom} shared a file with you`,
            html: template({ // sending data to email template
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size/1000)+' KB',
                expires: '24 hours'
            })
        }).then(()=>{
            return res.send({success: "successfully sent"});
        }).catch((err)=>{
            return res.status(500).send({error: `error in sending email`});
        });

        const response = await file.save();
    }catch(err){
        return res.status(500).send({error: "something went wrong"});
    }
    
});

export default router;