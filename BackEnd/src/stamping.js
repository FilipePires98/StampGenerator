
const gm = require('gm');
const fs = require('fs');
const constants = require('./constants');

module.exports = {
    applyStamp,
    waitForImageWrite
};

function applyStamp(file_info, stamp_position) {

    // path_output = appendSuffixToImage(file_info.path);
    path_output = file_info.path

    retval = {
        result: 1,
        out: path_output
    }

    /*
    gm().command("composite") 
        .in("-gravity", "center")
        .in(constants.path_stamp)
        .in(file_info.path)
        .write(path_output, function (err) {
            if (err) {
                console.log(err);
            }
        });
    */
    
    stamp_position = stamp_position[0] + "x" + stamp_position[1] + "+" + stamp_position[2] + "+" + stamp_position[3];
    gm().in('-geometry', "+0+0")
        .in(file_info.path)
        .in('-geometry', stamp_position) 
        .in(constants.path_stamp)
        .mosaic()
        .write(path_output, function (err) {
            if(err) {
                retval.out = err;
                retval.result = -1;
            } 
        });

    return retval;
}

// This function is used to ensure that the stamped image sent back as a response from the server is complete.
// This is definitely not optimized, an alternative implementation should be used where the stamped image produced by gm() is stored directly on a variable so that it can be immediately sent back.
function waitForImageWrite(path_image, timeout=100000, n_verifications=10000) {
    
    i = 0;                  // current iteration (max==timeout)
    previous_img_size = 0;  // as the image is being stored, its size increases; this variable is used to check if size increased after last iteration
    stabilized = 0;         // current verification; if image size does not increase after n_verifications, the size is considered stable and stamped image can be sent 

    retval = 1;             // return value status; if an error occurs, it returns a negative value

    while(i<timeout) {
        try {
            // check if file already exists
            if(fs.existsSync(path_image)) {
                current_img_size = fs.statSync(path_image).size;

                // compare image size between iterations
                if(current_img_size == previous_img_size) {
                    stabilized = stabilized + 1;

                    // check if image has been completely stored
                    if (stabilized == n_verifications) {
                        break;
                    }

                } else {
                    previous_img_size = current_img_size;
                }
            }
        } catch (err) {
            console.error(err);
            retval = -1;
            break;
        }
    }
    return retval;
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