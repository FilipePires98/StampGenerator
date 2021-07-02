
// External Dependencies
// (whenever a new module is required, use "npm install multer --save" so that in the future it is only needed to run "npm install")
const express = require('express');
const path = require('path');
const multer = require('multer'); 

// Internal Dependencies
const constants = require('./constants');
const stamping = require('./stamping');

// Application Startup

var app = express();
var port = process.env.PORT || constants.default_port

app.listen(port, () => {
    console.log("Server running on port " + port);
})

// Configuration for the storage procedure of images received

const imageStorage = multer.diskStorage({
    destination: constants.path_uploads, // destination to temporarily store image
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

app.post('/stamp', upload.single('file'), (req, res) => {

    // apply stamp to image and store it locally for logging purposes
    var stamp_application = stamping.applyStamp(req.file, constants.stamp_position);

    // check if stamping was successful
    if(stamp_application.result >= 0) {

        // wait until stamped image has been stored
        var wait_write = stamping.waitForImageWrite(stamp_application.out);

        // check if storing process did not timeout
        if (wait_write >= 0) {

            // send stamped file as a response to the api call
            res.sendFile(path.resolve(stamp_application.out));
        } else {
            res.status(402).send({ error: "timeout attempting to return stamped image." });
        }
        
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