const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3333;

// The Node.js file system module allows users to work with the file system on their computer using the require() method.
const fs = require("fs");

var notes = [];

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
    res.readFile(path.join(__dirname, "/db/db.json"));
});

// This is the route that receives a new note to save on the request body, adds it to the "db.json" file, and then returns the new note to the user.
app.post("/api/notes", (req, res) => {
    // The req.body is equal to the JSON post sent from the user. This works because of the body parsing middleware.
    var newNote = req.body;
    
    console.log(newNote);
  
    notes.push(newNote);
  
    res.json(newNote);

    fs.writeFile("/db/db.json", newNote, (err) => {
        if (err) throw err;
        console.log("New note has been saved!");
      });
  });

// * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique `id` when it's saved. 
// In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
// app.delete("/api/notes/:id", (req, res) => {
//     var deleteNote = req.params.id;

//   });

// This is the "catch-all" route that returns the user to the "index.html" file. It should display on the bottom as the last get route.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening on the port.
// =============================================================
app.listen(PORT, function() {
    console.log("Server application is listening on PORT " + PORT);
});