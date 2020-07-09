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
    res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

// This route reads the "db.json" file and returns all the saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.readFile(path.join(__dirname, "/db/db.json"));
});

// This is the route that receives a new note to save on the request body, adds it to the "db.json" file, and then returns the new note to the user.
app.post("/api/notes", (req, res) => {
    console.log("save routes")
    fs.readFile("/db/db.json", (err, data) => {
        console.log(data);
        // Creates a variable to get information from the "db.json" file, which is the array of notes. FS reads things as string, so JSON.parse() is needed to convert.
        notesArray = JSON.parse(data);
      });
    
    // The req.body is equal to the JSON post sent from the user. This works because of the body parsing middleware.
    var newNote = req.body;
    
    console.log(newNote);
    notesArray.push(newNote);
  
    // To write the file, the array of notes is passed as the second argument. FS reads things as string, so JSON.stringify() is needed to convert.
    fs.writeFile("/db/db.json", JSON.stringify(notesArray), (err) => {
        if (err) throw err;
        console.log("New note has been saved!");
        res.json(newNote);
      });
  });

// * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique `id` when it's saved. 
// In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("/db/db.json", (err, data) => {
        console.log(data);
        // Creates a variable to get information from the "db.json" file, which is the array of notes. FS reads things as string, so JSON.parse() is needed to convert.
        notesArray = JSON.parse(data);
      });
    
    var deletedNote = req.params.id;
    console.log("id: ",deletedNote);ß
    
    notesArray = notesArray.filter(() => {
    
    });

    console.log(notesArray)

    fs.writeFile("./db/db.json", JSON.stringify(deletedNotes), (err) => {
        if (err) throw err;
        res.json(deletedNotes);
    });
});

// This is the "catch-all" route that returns the user to the "index.html" file. It should display on the bottom as the last get route.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

// Starts the server to begin listening on the port.
// =============================================================
app.listen(PORT, function() {
    console.log("Server application is listening on PORT " + PORT);
});