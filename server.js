//setting up dependencies
const fs = require("fs");
const path = require("path");
const { v4: uuidv4, v4 } = require("uuid");
const express = require("express");

//setting up Express and defining PORT
const app = express();
const PORT = process.env.PORT || 3000;
const dbFile = path.join(__dirname, "db", "db.json");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//creating HTML routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//creating API routes AQUI
app.get("/api/notes", (req, res) => {
  let rawData = fs.readFileSync(dbFile);
  let notes = JSON.parse(rawData);
  let newArray = [];
  let idsList = Object.keys(notes);

  idsList.forEach(function (noteId) {
    let newNote = {
      id: noteId,
      title: notes[noteId]["title"],
      text: notes[noteId]["text"],
    };
    newArray.push(newNote);
  });

  return res.json(newArray);
});

app.post("/api/notes", (req, res) => {
  let id = v4();
  let title = req.body["title"];
  let text = req.body["text"];
  let rawData = fs.readFileSync(dbFile);
  let notes = JSON.parse(rawData);

  notes[id] = {
    title: title,
    text: text,
  };

  fs.writeFileSync(dbFile, JSON.stringify(notes));

  return res.json({
    id: id,
    title: title,
    text: text,
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let noteId = req.params.id;
  console.log(noteId);
  let rawData = fs.readFileSync(dbFile);
  let notes = JSON.parse(rawData);

  delete notes[noteId];

  fs.writeFileSync(dbFile, JSON.stringify(notes));

  return res.json({ mensagem: "file deleted!" });
});

//initializes the server to begin listening
app.listen(PORT, function () {
  console.log(`App listening on PORT ${PORT}`);
});
