
/**
 * Title: index.js
 * Description: Server's main file, where application is started and REST API is configured.
 * 
 * Author: Filipe Pires
 * Date: 04/07/2021
 */

// External Dependencies

const express = require('express');
const path = require('path');
const multer = require('multer'); 
const fs = require('fs');

// Internal Dependencies

const constants = require('./constants');
const stamping = require('./stamping');
const cors = require("./auth-cors");

// Application Startup

var app = express();
var port = process.env.PORT || constants.default_port

app.use(cors);

app.listen(port, () => {
    console.log("Server running on port " + port);
})

// Configuration for the storage procedure of images received

const imageStorage = multer.diskStorage({
    destination: constants.path_uploads, // destination to temporarily store original uploaded image
    filename: (req, file, cb) => { // generate unique file name
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: imageStorage,
    // limits: { fileSize: 1000000 /* 1 MB */ }, // uncomment only if you do not expect to receive large images
    fileFilter(req, file, cb) {

        // accept only .png and .jpg format
        if (!file.originalname.match(/\.(png|jpg)$/)) { 
            return cb(new Error('Please upload an image in jpg or png format.'))
        }
        cb(undefined, true)
    }
}) 

// REST API

app.get('/', (req, res) => { 
    res.send("StampGenerator Back-End"); 
});

app.post('/stamp', upload.single('file'), async (req, res) => {

    var stamp_application = await stamping.applyStamp(req.file, constants.stamp_position);
    if(stamp_application.result >= 0) {
        res.sendFile(path.resolve(stamp_application.out)); //, {encoding: 'base64'});
    } else {
        res.status(401).send({ error: stamp_application.out });
    }
    
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

/*
{
    fieldname: 'file',
    originalname: 'lenna.png',
    encoding: '7bit',
    mimetype: 'text/plain',
    destination: 'uploads/',
    filename: 'file_1625233259962.png',
    path: 'uploads\\file_1625233259962.png',
    size: 473831
}
*/