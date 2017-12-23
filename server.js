const express = require("express");
const app = express();

app.get('/foo', (req, res) => {
  res.send('"foo"')
});

app.listen(3001, () => {
  console.log('Running!');
});
