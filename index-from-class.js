const express = require("express");
const app = express();
const s3 = require("./s3");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

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

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    // req.file will refer to the image that was just uploaded
    console.log("req.file", req.file);

    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

//////////////////////////////////////////// DONT TOUCH ANYTHING ABOVE THIS LINE

app.get("/cities", (req, res) => {
    //res.json sends data back to the frontend as a response
    res.json(cities);
});

app.use(express.static("./public"));
app.listen(8080, () => console.log("Im listening!"));

// we will be using AXIOS, a JS library for making AJAX requests, to make GET and POST requests
// to our server without causing the page to reload

let cities = [
    {
        name: "Berlin",
        country: "Germany"
    },
    {
        name: "Sarajevo",
        country: "Bosnia"
    },
    {
        name: "New York",
        country: "USA"
    }
];
