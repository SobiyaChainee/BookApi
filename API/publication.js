const Router = require("express").Router();
const PublicationModel = require("../schema/publication");
const BookModel = require("../schema/book");

//Route         -/publication/new
//Description   -add a new publication
//Access        -public
//Paramameter   -none
//method        -post
Router.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);

    return res.json({ message: 'Publication added to the database' });
});

/*
Route           /publication/delete
Description     delete an publication
Access          PUBLIC
Parameters      id
Method          DELETE
 */
Router.delete("/publication/delete/:id", async(req, res) => {
    const { id } = req.params;

    const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
        id: parseInt(id)
    });

    return res.json({
        authors: updatePublicationDatabase
    });

});

/*
Route           /publication/delete/book
Description     delete a book from a publication
Access          public
Parameters      id, isbn
Method          DELETE
*/
Router.delete("/publication/delete/book/:isbn/:id", async(req, res) => {
    const { isbn, id } = req.params;


    const updatePublication = await BookModel.findOneAndUpdate({
        id: parseInt(id)
    }, {
        $pull: {
            books: isbn,
        }
    }, {
        new: true
    });


    const updateBook = await BookModel.findOneAndUpdate({
        ISBN: isbn
    }, {
        $pull: {
            publication: parseInt(id),
        }
    }, {
        new: true
    });

    return res.json({ books: updateBook, publication: updatePublication });
});

module.exports = Router;