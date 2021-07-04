# StampGenerator
A Simple Image Stamping Web Service

## Description

Stamp Generator consists of: 
- a simple web back-end service that inputs an image (using POST) and adds a stamp/watermark on top of the image and returns the image with the stamp
- a simple browser-based Three.js application that prompts the user to upload an image, calls the back-end to add a stamp to the image and show's a very simple "art gallery" with the uploaded image with a stamp

![banner](https://github.com/FilipePires98/StampGenerator/blob/main/BackEnd/public/banner.png)

## Instructions to Build and Run

### Back-End

1. Install either [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](https://imagemagick.org/index.php).
2. Install module dependencies:
```console
$ npm install
```
3. Run:
```console
$ npm start
```

If you wish to test the API without any front-end, you can use the Python client script inside \dev:
```console
$ pip install -r .\requirements.txt
$ python client.py
```
Alternatively, you can use a tool like Postman for a more friendly GUI.

### Front-End

All dependencies are statically available in \libs.
All you need to do is open the index.html in your browser and upload your files to create your own gallery.

## Instructions to Use the Web UI

1. The gallery will be empty by default (dark background). Click on the "Choose File" button to start creating your stamped collection. 
2. Select the image file (.png/.jpg) you wish to upload and click on "Open".
3. Click on the "Upload" button and wait for the server to respond.
4. Once image processing is complete, the stamped image will be added to your gallery and a pop-up will appear for you to store the stamped image on your local drive.
5. You can interact with the gallery carousel with your mouse. Have fun!

## Future Work

The work developed is very simple and it is meant only to show the potential of developing Three.js applications that interact with remote servers.
Future developments could include tasks such as:
- Store uploaded files in cache (currently uploads are forgotten on page reload)
- Allow user to upload a personalized stamp
- Adapt carousel's radius according to the number of images uploaded
- Adapt image format of carousel to source image's format
- Allow multiple files to be uploaded at once
- etc.

## Author

The author of this repository is Filipe Pires and the project was developed to experiment with node's capabilities of providing REST API-based services with image processing.

For further information, please contact me at filipesnetopires@ua.pt.
