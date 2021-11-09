require('dotenv').config();
const express = require("express");

const mongoose = require("mongoose");

//importing different schemas
const Book = require('./schema/book');
const Author = require('./schema/author');
const publication = require('./schema/publication');

//database
const Database = require("./database");

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

OurAPP.get("/", (request, response) => { //callback function
    response.json({ message: "Server is working!!!!!" });
});


//Route     - /book
//Description - to get all books
//Access    - public
//Method    - get
//Params    - none
//body      - none
OurAPP.get("/book", async(req, res) => {
    const getAllBooks = await Book.find();
    return res.json(getAllBooks);
});


//Route     - /book/:bookID
//Description - to get a book based on ISBN
//Access    - public
//Method    - get
//Params    - bookID
//body      - none
OurAPP.get("/book/:bookID", async(req, res) => {
    const getSpecificBook = await Book.findOne({ ISBN: req.params.bookID });

    if (!getSpecificBook) {
        return res.json({
            errror: `No book found for the ISBN of ${req.params.bookID}`
        });
    }
    return res.json({ book: getSpecificBook });
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

OurAPP.get("/book/a/:authors"), (req, res) => {
    const getBook = Database.Book.filter(
        (book) => book.authors.includes(req.params.authors)
    );

    return res.json({ book: getBook });
};


//Route     - /author
//Description - to get all authors
//Access    - public
//Method    - get
//Params    - none
//body      - none
OurAPP.get("/author", (req, res) => {
    return res.json({ author: Database.Author });
});


//Route         -/book/new
//Description   -add new book
//Access        -public
//Paramameter   -none
//method        -post
OurAPP.post("/book/new", async(req, res) => {
    try {
        const { newBook } = req.body;

        await Book.create(newBook);
        return res.json({ message: 'Book added to the database' });

    } catch (error) {
        return res.json({ error: error.message });
    }
});

//Route         -/author/new
//Description   -add a new author
//Access        -public
//Paramameter   -none
//method        -post
OurAPP.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    Database.Author.push(newAuthor);

    return res.json(Database.Author);
});

//Route         -/publication/new
//Description   -add a new publication
//Access        -public
//Paramameter   -none
//method        -post
OurAPP.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    Database.Publication.push(newPublication);

    return res.json(Database.Publication);
});

//Route         -/book/update
//Description   -update any details of the book
//Access        -public
//Paramameter   -ISBN
//method        -put
OurAPP.put("/book/update/:isbn", (req, res) => {
    const { updatedBook } = req.body;
    const { isbn } = req.params;

    const book = Database.Book.map((book) => {
        if (book.ISBN === isbn) {
            // console.log({...book, ...updatedBook });
            return {...book, ...updatedBook };
        }
        return book;
    })
    return res.json(book);

});

//Riute         -/book /updateTitle
//Descrption    -update title f a book
//Access        -public
//Parametes     -isbn
//Mathod        -PUT
OurAPP.put("/book/updateTitle/:isbn", (req, res) => {
    const { updatedBook } = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.title = updatedBook.title;
            return book;
        }
        return book;
    });

    return res.json(Database.Book);
});

//Route         -/bookAuthor/update
//Description   -update/add new author to book
//Access        -public
//Paramameter   -ISBN
//method        -put
OurAPP.put("/bookAuthor/update/:isbn", (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN == isbn) {
            if (!book.authors.includes(newAuthor)) {
                return book.authors.push(newAuthor);
            }
            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if (author.id == newAuthor) {
            if (!author.books.includes(isbn)) {
                return author.books.push(isbn);
            }
            return author;
        }
        return author;
    });

    return res.json({ book: Database.Book, author: Database.Author });

});

//Route         -/author/updateName
//Description   -Update name of the author
//Access        -Public
//Parameter     -id
//Mathod        -Put
/*OurAPP.put("/author/updateName/:id", (req, res) => {

})*/

//Route         -/author/update/:id
//Description   -updating author
//Access        -public
//Paramameter   -id
//method        -put
OurAPP.put("/author/update/:id", (req, res) => {
    const { updateAuthor } = req.body;
    const { id } = req.params;

    const author = Database.Author.map((author) => {
        if (author.id === parseInt(id)) {
            // console.log({...book, ...updatedBook });
            return {...author, ...updateAuthor };
        }
        return author;
    })
    return res.json(author);
});

//Route           -/book/delete
//description      - delete a book 
//Access    	    public
//parameter         isbn
//method            delete
OurAPP.delete("/book/delete/:isbn", (req, res) => {
    const { isbn } = req.params;

    const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);

    Database.Book = filteredBooks;

    return res.json(Database.Book);
});

/*
Route               /book/deleter/auhtor
Description         delete a authopr from a book
Access              Public
Parameters          id, isbn
method              delete
*/
OurAPP.delete("/book/deleter/auhtor/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            if (!book.authors.includes(parseInt(id))) {
                return book;
            }

            book.authors = book.authors.filter((DatabaseID) => DatabaseID !== parseInt(id));

            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)) {
            if (!author.books.includes(isbn)) {
                return author;
            }

            author.books = author.books.filter((book) => book !== isbn);

            return author;
        }
        return author;


    });
    return res.json({ book: Database.Book, author: Database.Author });
});


/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      id
Method          DELETE
*/

OurAPP.delete("/author/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredAuthors = Database.Author.filter((author) => author.id !== parseInt(id));

    Database.Author = filteredAuthors;

    return res.json(Database.Author);

});

/*
Route           /publication/delete
Description     delete an publication
Access          PUBLIC
Parameters      id
Method          DELETE
 */
OurAPP.delete("/publication/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredPub = Database.Publication.filter((pub) => pub.id !== parseInt(id));

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});

/*
Route           /publication/delete/book
Description     delete a book from a publication
Access          public
Parameters      id, isbn
Method          DELETE
*/
OurAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN == isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({ book: Database.Book, publication: Database.Publication });
});
OurAPP.listen(4000, () => console.log("Server is running"));