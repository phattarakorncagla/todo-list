const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const tagsRoutes = require('./routes/tags');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/notes', notesRoutes);
app.use('/tags', tagsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});