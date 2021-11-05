import express from 'express';
const router = express.Router();
import Files from '../models/files';

router.get('/:uuid', async (req, res)=>{
    // extract link and get file from storage
    const file = await Files.findOne({uuid: req.params.uuid});
    // link expired
    if (!file){
        return res.render('download', {error: 'link has been expired'}); // download.ejs
    }
    //const respose = await file.save();
    const filePath = `${__dirname}/../${file.path}`; // file.path - upload/fileName.ext
    res.download(filePath); // to download that file
});

export default router;