/*

Requirements

Book              
-ISBN               -String
-Title              -String
-Author             -[Number]
-Language           -String
-Publications       -Number
-NumOfPages         -Number
-Catogories         -[String]

Author
-id             -Number
-Name           -String
-books  	    -[String]

Publication
-id             -Number
-Name           -String
-books  	    -[String]


----------APIs-----------

Book
 -GET
  -to get all books ✅
  -to get specific books ✅
  -to get a list of books based on category ✅
  -to get a list of books based on author [task]

 -POST
 -to add new books ✅

 -PUT
  -to update book details ✅
  -to update/add new author ✅
  

 -DELETE
  -delete a book 
  -delete an author from the book


Authors 

 -GET
  -to get all authors ✅
  -to get specific author [task]
  -to get list author based on a book

 -POST
  -to add new author ✅
  -to update/add new book

 -PUT
  -update author details ✅

 -DELETE
  -delete an author

Publication
 -GET
  -to get all publication
  -to get specific publication
  -to get a list of publication based on a book
 
 -POST
  -add new publication ✅

 -PUT
  -update publication 
  -to update/add new book

 -DELETE
  -delete a book from a publication
  -delete a publication

*/