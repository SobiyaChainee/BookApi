const Router = require("express").Router();
const AuthorModel = require("../schema/author");

//Route     - /author
//Description - to get all authors
//Access    - public
//Method    - get
//Params    - none
//body      - none
Router.get("/author", async(req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

//Route         -/author/new
//Description   -add a new author
//Access        -public
//Paramameter   -none
//method        -post
Router.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: 'Author added to the database' });
});


//Route         -/author/update/:id
//Description   -updating author
//Access        -public
//Paramameter   -id
//method        -put
Router.put("/author/update/:id", (req, res) => {
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

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      id
Method          DELETE
*/

Router.delete("/author/delete/:id", async(req, res) => {
    const { id } = req.params;

    const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
        id: parseInt(id)
    });

    return res.json({
        authors: updateAuthorDatabase
    });

});


module.exports = Router;