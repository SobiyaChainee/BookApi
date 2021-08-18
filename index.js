const express = require("express");

//Initialization of App
const OurApp = express();

OurApp.get("/", (request, response) => {
    response.json({ message: "Request served!!!!!" });
});

OurApp.listen(4000, () => console.log("Server is running"));