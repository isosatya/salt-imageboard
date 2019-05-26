const express = require("express");
const app = express();
const db = require("./utils/db");

// const for constructing the url address
const urlPrefx = "https://s3.amazonaws.com/andres-spiced/";

// This is the module that uploads the image to Amazon
const s3 = require("./s3");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

// This uploads the image to the local storate
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

// These are the parameters for the upload
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static("./public"));

// First the file is uploaded to the local storage, then the s3 function will be run, and then
// the file information is stored in the sql database

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    // req.file will refer to the image that was just uploaded
    // console.log("req.file", req.file);
    var url = urlPrefx + req.file.filename;
    var title = req.body.title;
    var description = req.body.description;
    var username = req.body.username;

    // console.log("url", url);

    db.insertImages(url, username, title, description)
        .then(resp => {
            console.log("image inserted successfully");
            // Sending the response from the backend, back to the frontend. It needs to be in the json format
            // Do not forget to use "rows[0]"
            res.json(resp.rows[0]);
        })
        .catch(err => console.log("error when at insertImages query", err));
});

//////////////////////////////////////////// DONT TOUCH ANYTHING ABOVE THIS LINE

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => console.log("error at the getImages function", err));
});

app.get("/image-info/:pictureId", (req, res) => {
    const pictureId = req.params.pictureId;
    db.viewComments(pictureId)
        .then(results => {
            // console.log("response from viewComments", results.rows);
            res.json(results.rows);
        })
        .catch(err => console.log("Error at the viewComments query", err));
});

app.post("/image-comment/", (req, res) => {
    //// the req.body information is what comes from the Form data sent from the frontend
    const pictureid = req.body.pictureId;
    const username = req.body.username;
    const comment = req.body.comment;

    db.addComments(pictureid, username, comment)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => console.log("Error at the addComments query", err));
});

app.listen(8080, () => console.log("Im listening!"));
