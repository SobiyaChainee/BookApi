require('dotenv').config();
const express = require("express");

const mongoose = require("mongoose");

//importing different schemas
const BookModel = require('./schema/book');
const AuthorModel = require('./schema/author');
const PublicationModel = require('./schema/publication');

//API
const Book = require('./API/book');
const Author = require('./API/author');
const Publication = require('./API/publication');


mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(() => console.log('connection extablished!'))
    .catch((err) => {
        console.log(err);
    });

//Initialization of App
const OurAPP = express();

OurAPP.use(express.json());

//Microservices
OurAPP.use("/book", Book);
OurAPP.use("/author", Author);
OurAPP.use("/publication", Publication);

OurAPP.get("/", (request, response) => { //callback function
    response.json({ message: "Server is working!!!!!" });
});

OurAPP.listen(4000, () => console.log("Server is running"));