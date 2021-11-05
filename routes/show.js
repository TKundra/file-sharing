import express from 'express';
const router = express.Router();
import Files from '../models/files';

// render will send - fileName, fileSize, downloadLink, error on webpage && over webpage you can use those data using same name
router.get('/:uuid', async (req, res)=>{
    try {
        const files = await Files.findOne({uuid: req.params.uuid});
        if (!files){
            return res.render('download', {error: 'something went wrong'}); // download.ejs
        }
        return res.render('download', {
            uuid: files.uuid, 
            fileName: files.fileName,
            fileSize: files.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${files.uuid}` // http://localhost:3000/files/download/463re76gr64-fhur476
            // this link make call to - url/files/download/uuid pasge i.e download.js
        });
    }catch(error){
        return res.render('download', {error: 'something went wrong'});
    }

});

export default router;