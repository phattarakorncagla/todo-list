const express = require('express');
const router = express.Router();
const connection = require('../db');
const { v4: uuidV4 } = require('uuid');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM tags', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching tags');
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { label } = req.body;
  const id = uuidV4();
  connection.query('INSERT INTO tags (id, label) VALUES (?, ?)', [id, String(label)], (err) => {
    if (err) {
      res.status(500).send('Error creating tag');
      return;
    }
    res.status(201).send({ id, label: String(label) });
  });
});

router.put('/:id', (req, res) => {
  const { label } = req.body;
  const { id } = req.params;
  connection.query('UPDATE tags SET label = ? WHERE id = ?', [String(label), id], (err) => {
    if (err) {
      res.status(500).send('Error updating tag');
      return;
    }
    res.status(200).send({ id, label: String(label) });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tags WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).send('Error deleting tag');
      return;
    }
    res.status(200).send('Tag deleted');
  });
});

module.exports = router;