const express = require("express");

//database
const Database = require("./database");

//Initialization of App
const OurAPP = express();


OurAPP.get("/", (request, response) => {
    response.json({ message: "Server is working!!!!!" });
});


//Route     - /book
//Description - to get all books
//Access    - public
//Method    - get
//Params    - none
//body      - none
OurAPP.get("/book", (req, res) => {
    return res.json({ books: Database.Book });
});


//Route     - /book/:bookID
//Description - to get a book based on ISBN
//Access    - public
//Method    - get
//Params    - bookID
//body      - none
OurAPP.get("/book/:bookID", (req, res) => {
    const getBook = Database.Book.filter(
        (book) => book.ISBN === req.params.bookID
    );

    return res.json({ book: getBook });
});


//Route     - /book/c/:category
//Description - to get a list of books based on category
//Access    - public
//Method    - get
//Params    - category
//body      - none

OurAPP.get("/book/c/:category", (req, res) => {
    const getBook = Database.Book.filter((book) =>
        book.category.includes(req.params.category)
    );

    return res.json({ book: getBook });

});

OurAPP.listen(4000, () => console.log("Server is running"));