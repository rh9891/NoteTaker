const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3333;

// The Node.js file system module allows users to work with the file system on their computer using the require() method.
const fs = require("fs");

var notesArray = [];

// Sets up the Express.js application to handle data parsing.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Built-in middleware that enables the use of static files. 
app.use(express.static("public"));

// This route returns the "notes.html" file.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// This route reads the "db.json" file and returns all the saved notes as JSON.
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
    console.log(data);
    // Creates a variable to get information from the "db.json" file, which is the array of notes. FS reads things as string, so JSON.parse() is needed to convert.
    notesArray = JSON.parse(data);
    res.json(notesArray);
    });
});


// This is the route that receives a new note to save on the request body, adds it to the "db.json" file, and then returns the new note to the user.
app.post("/api/notes", (req, res) => {
    console.log("Save routes are locating array of notes.")
    fs.readFile(path.join(__dirname, "/db/db.json"), (err, data) => {
        console.log(data);
        // Creates a variable to get information from the "db.json" file, which is the array of notes. FS reads things as string, so JSON.parse() is needed to convert.
        notesArray = JSON.parse(data);
      });
    
    var newNoteID = 0;
        if(notesArray.length > 0) {
            var lastNote = notesArray[notesArray.length - 1];
            newNoteID = lastNote.id + 1;
        };
    // The req.body is equal to the JSON post sent from the user. This works because of the body parsing middleware.
    var newNote = {id: newNoteID, title: req.body.title, text:req.body.text};
    
    console.log(newNote);
    notesArray.push(newNote);
  
    // To write the file, the array of notes is passed as the second argument. FS reads things as string, so JSON.stringify() is needed to convert.
    fs.writeFile("db/db.json", JSON.stringify(notesArray), (err) => {
        if (err) throw err;
        console.log("New note has been saved!");
        res.json(newNote);
      });
  });

// This route receives a query parameter containing the id of a note to delete. Each note is given a unique `id` when it is saved. In order to delete a note, this route reads all notes from the `db.json` file, removes the note with the given `id` property, and then rewrites the notes to the `db.json` file.
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        console.log(data);
        // Creates a variable to get information from the "db.json" file, which is the array of notes. FS reads things as string, so JSON.parse() is needed to convert.
        notesArray = JSON.parse(data);
      });
    
    var deletedNote = req.params.id;
    console.log("id: ", deletedNote);
    
    notesArray = notesArray.filter((note) => {
        return note.id != deletedNote;
    });

    console.log(notesArray)

    fs.writeFile("db/db.json", JSON.stringify(deletedNote), (err) => {
        if (err) throw err;
        res.json(deletedNote);
    });
});

// This is the "catch-all" route that returns the user to the "index.html" file. It should display on the bottom as the last get route.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening on the port.
// =============================================================
app.listen(PORT, function() {
    console.log("Server application is listening on PORT " + PORT);
});