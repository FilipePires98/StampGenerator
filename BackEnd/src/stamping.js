
// This module contains the server logic. Additional stamping-related features would be added here.

const gm = require('gm');
const fs = require('fs');
const constants = require('./constants');

module.exports = {
    applyStamp
};

// Here is where the stamp is actually applied on the uploaded image.
async function applyStamp(file_info, stamp_position) {

    // path_output = appendSuffixToImage(file_info.path);
    path_output = file_info.path

    retval = {
        result: 1,
        out: path_output
    }

    stamp_position = stamp_position[0] + "x" + stamp_position[1] + "+" + stamp_position[2] + "+" + stamp_position[3];
    return new Promise(function(resolve,reject){
        gm().in('-geometry', "+0+0")
            .in(file_info.path)
            .in('-geometry', stamp_position) 
            .in(constants.path_stamp)
            .mosaic()
            .write(path_output, function (err) {
                if(err) {
                    retval.out = err;
                    retval.result = -1;
                    reject(retval);
                } else {
                    console.log('Saved!');
                    resolve(retval);
                };
            });
    });
}

// This function can be used if you wish to store in the server both the input image and its stamped version
function appendSuffixToImage(path_image) {
    path_output = ""
    substrings = path_image.split(".")
    for(var i=0; i<substrings.length; i++){
        if(i<substrings.length-1) {
            path_output = path_output + substrings[i]
        }
    }
    path_output = path_output + "_watermarked." + substrings[substrings.length-1];
    return path_output;
}