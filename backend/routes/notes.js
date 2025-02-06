const express = require("express");
const router = express.Router();
const connection = require("../db");
const { v4: uuidV4 } = require("uuid");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM notes", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching notes");
      return;
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { title, markdown, tagIds } = req.body;
  const id = uuidV4();
  connection.query(
    "INSERT INTO notes (id, title, markdown, tagIds) VALUES (?, ?, ?, ?)",
    [id, title, markdown, JSON.stringify(tagIds)],
    (err) => {
      if (err) {
        res.status(500).send("Error creating note");
        return;
      }
      res.status(201).send("Note created");
    }
  );
});

router.put("/:id", (req, res) => {
  const { title, markdown, tagIds } = req.body;
  const { id } = req.params;
  connection.query(
    "UPDATE notes SET title = ?, markdown = ?, tagIds = ? WHERE id = ?",
    [title, markdown, JSON.stringify(tagIds), id],
    (err) => {
      if (err) {
        res.status(500).send("Error updating note");
        return;
      }
      res.status(200).send("Note updated");
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM notes WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).send("Error deleting note");
      return;
    }
    res.status(200).send("Note deleted");
  });
});

module.exports = router;
