(function() {
    // this component is the modal that will popup

    /////////// here we define the modal component which, depends from the main Vue object
    /////////// and inserts the html element in the DOM

    ///// popup-pictures is the modal component, which is children of the main Vue object, and needs templates
    Vue.component("popup-pictures", {
        //// defining the template which is part of the modal component
        template: "#pictures-template",
        //// properties that are called here so the can be inherited from the main Vue object
        props: ["pictureId"],
        //// definition of the data native to the modal component, to which the modal component have access
        //// scope is only within the componenet, so if the parent Vue object needs it, it needs to be emmited ($emit)
        data: function() {
            //// this is a function which returns an object
            //// unlike the main Vue object, here we need a function with a "return" statement
            return {
                //// "pictureComments" is the placeholder which will receive the array element with all the
                //// comments rendered from the sql database
                //// I am usind the hash value from the url address as the pictureId property instead of
                //// getting it from the main Vue object

                imageinfo: "",
                tags: [],
                pictureComments: "",
                //// Form object that needs to be matched to its html element, and which contains the comments information
                formComments: {
                    username: "",
                    comment: "",
                    //// the "this.pictureId" refers to the property from the main Vue obj., which is then
                    //// assigned to the "pictureId" field of the "formComments" Form
                    //// "pictureId" in this case is native to the modal component and "this.pictureId" refers the
                    //// property inherited from the main Vue object. "this" is the modal component, but i have to assign
                    //// the propert to the property native to the modal component
                    pictureId: this.pictureId
                }
            };
        },
        watch: {
            //// Whenever the url has changes, the same function as "mounted" is called, so the picture info info is
            //// rendered again, for the new picture hash, this will be useful for switching between pictures in the
            //// popup
            pictureId: function() {
                var self = this;
                axios
                    .get("/image-info/" + this.pictureId)
                    .then(function(resp) {
                        self.imageinfo = resp.data[0][0];
                        console.log("self.imageinfo", self.imageinfo);
                        if (self.imageinfo.tags != "") {
                            self.tags = self.imageinfo.tags.split(", ");
                        }
                        self.pictureComments = resp.data[1];
                    })
                    .catch(function(err) {
                        location.hash = "";
                        self.$emit("close-popup");
                        console.log("Error at getting /image-info/ route", err);
                    });
            }
        }, //closes "watch"

        //// This Code will run only after the entire view from the main Vue obj. has been rendered
        //// once all the pictures are rendered, this function will run to get additional information about
        /// the picture which was clicked
        //// mounted is what renders the data
        mounted: function() {
            var self = this;
            //// the "/image-info/" route, plus a variable as part of the the route address is sent to
            //// the backend
            //// when axios is used, the route address itself is not relevent, but it´s only way to
            //// identify certain actions

            axios
                //// there parameter for the route is the picture id, which is used in the backend as
                //// a parameter for the db query
                .get("/image-info/" + this.pictureId)
                .then(function(resp) {
                    //// Data from the backend response is assigned to the "pictureComments"
                    //// properties in the frontend, after the first get route promise is successful
                    console.log(
                        "response from getSpecificImage query",
                        resp.data
                    );

                    self.imageinfo = resp.data[0][0];
                    console.log("infor about the image", self.imageinfo);
                    if (self.imageinfo.tags != "") {
                        self.tags = self.imageinfo.tags.split(", ");
                    }
                    self.pictureComments = resp.data[1];
                })
                .catch(function(err) {
                    location.hash = "";
                    self.$emit("close-popup");
                    console.log("Error at getting /image-info/ route", err);
                });
        },
        //// "methods" are the function that are run based on a certain event
        methods: {
            //// appending the comment Form information as part of a new FormData object
            submitComment: function() {
                //// here we dont need a new formData object, because there is no file upload involved
                var formFields = this.formComments;
                var comment = this.pictureComments;
                if (formFields.username && formFields.comment != "") {
                    axios
                        .post("/image-comment/", this.formComments)
                        .then(function(resp) {
                            comment.unshift({
                                comment: resp.data[0].comment,
                                created_at: resp.data[0].created_at,
                                username: resp.data[0].username
                            });
                            formFields.username = null;
                            formFields.comment = null;
                        })
                        .catch(function(err) {
                            console.log(
                                "Error at the post /image-comment/ route",
                                err
                            );
                        });
                } else {
                    window.alert("Please fill in both fields");
                }
            },
            //// this function emits the "0" value when its clicked on the event listener in the html
            closePopup: function() {
                location.hash = "";
                this.$emit("close-popup");
            }
        } //closes methods
    });

    /////////////////////////////////////////////////////////////// Parent Vue Object
    new Vue({
        //// the html element to which the Vue object applies
        el: "#main",
        //// the properties (variables) to be used in the object, created as placeholders
        data: {
            //// images is an array which will receive many objects
            images: [],
            //// property declared as strings:
            //// if I dont assign the url hash as the pictureId, the hash will stay but the pop up wont show up
            pictureId: location.hash.slice(1),

            //// property declared as a value (number)

            //// Form object, which needs to be matched to its html elements and contains the information to be
            //// submitted to the backend
            form: {
                title: "",
                description: "",
                username: "",
                tags: "",
                //// when it´s a file, it needs to have value null and be treated in a very particular way
                file: null
            },
            latestPicId: "",
            firstPicId: ""
        }, // closes data

        //// function that gets the images from the backend, to render them at the frontend
        mounted: function() {
            //// here the "this" is still the main Vue object
            var self = this;
            //// when the hash changes, the "pictureId" gets the hash value, and that opens up the popup
            addEventListener("hashchange", function() {
                console.log("I am inside the parent Vue hashchange listener");
                self.pictureId = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(function(resp) {
                    //// assigning the successful backend images response to the "images" property of the Vue object
                    self.images = resp.data;
                    console.log("self.images", self.images);
                    self.latestPicId = self.images[self.images.length - 1].id;
                })
                .catch(function(err) {
                    console.log("Error at the /images route", err);
                });
        }, //closes "mounted"

        //// functions that run based on the events that are listened to in the html
        methods: {
            //// function run based on the clicking on the rendered picture
            ////         this function has been replaced by the "hash change listener function", which changes when the
            ////        url hash changes
            // togglePictureModal: function(
            //     url,
            //     title,
            //     username,
            //     description,
            //     date,
            //     imageid
            // ) {
            //     //// assiging the already rendered information, but to an individual level, based on the
            //     //// picture that it was clicked on. So here the information from the html element itself
            //     //// is used as an argument of the togglePictureModal function and then assigned to the
            //     //// properties of the Vue object. Here "this" refers to the main Vue obj.
            //     this.pictureUrl = url;
            //     this.pictureTitle = title;
            //     this.pictureUsername = username;
            //     this.pictureDesc = description;
            //     this.pictureDate = new Date(date).toISOString();
            //     this.pictureId = imageid;
            //     //// only if the tittle is not "", the popup will show up
            //     //// this condition can also be used directl in the hmtl element, insted of the "popup" property
            //     // if (this.pictureTitle.length > 0) {
            //     //     this.popup = 1;
            //     // }
            // },

            //// in case the "change" events happens in html, this function is executed, which assigns the file
            //// which is part of the e.target element, to the "file" property of the "form" object, which is part
            //// of the main Vue object
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },
            //// funcion which is run once I submit the Upload button in the "form" Form html element
            uploadFile: function() {
                //// appending all the values to the new FormData object
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description);
                formData.append("tags", this.form.tags);

                this.form.title = "";
                this.form.description = "";
                this.form.username = "";
                this.form.tags = "";
                this.form.file = null;

                //// I have to assign the "this" outside of the route, otherwise inside the route,
                //// the "this" becomes the Window and not the Vue obj. anymore
                var self = this;
                var repository = this.images;
                //// once I submit the form, the post request to the backend is sent, with the file
                //// information for the upload

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        //// after getting the successful response from the "upload", it adds the response object with the
                        //// picture url, to the beginning of the main Vue obj. images element (which is an array)
                        repository.unshift(resp.data);
                        self.latestPicId = repository[repository.length - 1].id;
                    })
                    .catch(function(err) {
                        console.log("Error when uploading picture", err);
                    });
            },
            //// this is the function executed based on the custom event listener defined in the modal component
            //// to which it is listened to in the parent object. The "updatePopUp" argument is the "$event" argument
            //// which is actually the value emmited by the custom defined event
            updatePopUp: function() {
                this.pictureId = "";
            },

            getTaggedImg: function(tag) {
                const self = this;
                axios
                    .get("/tagged-images/" + tag)
                    .then(function(resp) {
                        console.log("resp.data for tagged images", resp.data);
                        self.images = resp.data;
                        self.pictureId = "";
                    })
                    .catch(function(err) {
                        console.log("Error at the getTaggedImg functions", err);
                    });
            },

            morePics: function() {
                var repository = this.images;
                var self = this;
                axios
                    .get("/more-images/" + this.latestPicId)
                    .then(function(resp) {
                        //// pushing the elements inside the array, which contains the rest of the Images
                        //// obtained through the getMoreImages db query
                        repository.push(...resp.data);

                        //// updating the index of the last picture rendered
                        self.latestPicId = repository[repository.length - 1].id;
                        //// updating the variable which stores the index of the first entry of the
                        //// images table, so it can be compared at the if condition of the "more pictures" button
                        self.firstPicId = resp.data[0].firstindexid;
                        console.log("self.firstPicId", self.firstPicId);
                    })
                    .catch(function(err) {
                        console.log("Error at /more-images/ route", err);
                    });
            }
        } //closes methods
    });
})();
