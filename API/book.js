const Router = require("express").Router();

const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");

//Route     - /book
//Description - to get all books
//Access    - public
//Method    - get
//Params    - none
//body      - none
Router.get("/book", async(req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

//Route     - /book/:bookID
//Description - to get a book based on ISBN
//Access    - public
//Method    - get
//Params    - bookID
//body      - none
Router.get("/book/:bookID", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.bookID });

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

Router.get("/book/c/:category", async(req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`
        });
    }

    return res.json({ books: getSpecificBooks });
});

//Route         -/book/new
//Description   -add new book
//Access        -public
//Paramameter   -none
//method        -post
Router.post("/book/new", async(req, res) => {
    try {
        const { newBook } = req.body;

        await BookModel.create(newBook);
        return res.json({ message: 'Book added to the database' });

    } catch (error) {
        return res.json({ error: error.message });
    }
});

//Route         -/book /updateTitle
//Descrption    -update title f a book
//Access        -public
//Parametes     -isbn
//Mathod        -PUT
Router.put("/book/updateTitle/:isbn", async(req, res) => {
    const { title } = req.body.title;

    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    }, {
        title: title
    }, {
        new: true
    });

    return res.json({ book: updateBook });
});

//Route         -/book/updateAuthor/:isbn
//Description   -update/add new author to book
//Access        -public
//Paramameter   -ISBN
//method        -put
Router.put("/book/updateAuthor/:isbn", async(req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: isbn,
    }, {
        $addToSet: {
            authors: newAuthor,
        }
    }, {
        new: true,
    });

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: newAuthor,
    }, {
        $addToSet: {
            books: isbn,
        }
    }, {
        new: true,
    })

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: 'New author was added into the database'
    });

});

//Route         -/book/update
//Description   -update any details of the book
//Access        -public
//Paramameter   -ISBN
//method        -put
Router.put("/book/update/:isbn", (req, res) => {
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

//Route           -/book/delete
//description      - delete a book 
//Access    	    public
//parameter         isbn
//method            delete
Router.delete("/book/delete/:isbn", async(req, res) => {
    const { isbn } = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN: isbn
    });

    return res.json({
        books: updateBookDatabase
    });
});

/*
Route               /book/delete/author
Description         delete a author from a book
Access              Public
Parameters          id, isbn
method              delete
*/
Router.delete("/book/delete/author/:isbn/:id", async(req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: isbn
    }, {
        $pull: {
            authors: parseInt(id),
        }
    }, {
        new: true
    });

    const updateAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(id)
    }, {
        $pull: {
            books: isbn
        }
    }, {
        new: true
    });

    return res.json({
        message: 'Author was deleted',
        books: updateBook,
        authors: updateAuthor
    });
});

module.exports = Router;