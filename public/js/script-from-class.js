// this is where ALL our code will reside

(function() {
    // this component is the modal that will popup
    Vue.component("cute-animal-modal", {
        // #1 option to define the html right here in my object:
        //          template: `<div class="cute-animal-container">
        //                      <h1> this is a cute animal!</h1>
        //                      </div>`
        //
        // #2 option to define the html for the modal in the html file,
        // and then tell my component where to find the html for the component:
        template: "#cute-animal-template",
        props: ["name", "animalThatWasClicked"], // i indicate here that the component should have access to "name" property
        // which comes from the parent Vue instance "data"
        data: function() {
            // this is a function which returns an object
            return {
                animalName: "Layla" // Vue components ONLY have access to their own "data"
                // VUe components DO NOT have acess to the data of their parents (Vue instance)
                // Vue instance does not have access to the data of their children
                // but i cant take "data" from the parents and give them to components
            };
        },
        mounted: function() {
            console.log("this", this);
        }
    });

    new Vue({
        // the majority of our Vue code will go inside this object
        el: "#main",

        // data is extremely important
        data: {
            name: " Andres",
            cities: [],
            form: {
                //all these could have completely different names than the form fields
                title: "", // but its good practice to name them the same
                description: "",
                username: "",
                file: null
            },
            cuteAnimals: [
                {
                    name: "rabbit",
                    cuteness: 7
                },
                {
                    name: "otter",
                    cuteness: 8
                },
                {
                    name: "penguin",
                    cuteness: 9
                } // closes pengin
            ] // closes cuteAnimals
        }, // closes 'data'

        // mounted is something we call a 'lifecycle' method
        mounted: function() {
            // here we´re going to make AXIOS requests to get data (GET request to server)
            // from the server that we need to then render on screen

            //data is the property of RESP that contains the info
            // we requested from the server
            var self = this;
            axios.get("/cities").then(function(resp) {
                // self.cities is the cities array in 'data'
                // resp.data represents the cities array i got from the server
                self.cities = resp.data;
                // with this code, the backend array data lives now in the Vue object
                // console.log("GET /cities", resp.data);
                // console.log("self.cities ", self.cities);
                // self.cities refers to the cities array in 'data'
            });
        }, // closes mounted --> don´t forget to add the , to each part i add in the Vue object

        methods: {
            // every single funcion that runs in response to an event will be written here
            // this is the even i have in the Form file field
            handleFileChange: function(e) {
                // console.log("handleFileChange e running", e.target.files[0]);

                // console.log("this", this);
                // taking the file from the form and storing it in 'data', it doesnt work
                // dynamically like the form fields
                this.form.file = e.target.files[0];
            },

            uploadFile: function() {
                // we have to use an API called FormData to handle the file
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("username", this.form.username);
                formData.append("description", this.form.description); // this method is specific to FormData -> check documentation
                // console.log("formData", formData);

                axios.post("/upload", formData).then(function(resp) {
                    console.log("resp in POST / upload", resp);
                });
            }
        } // closee methods
    }); // closes Vue instance
})();
