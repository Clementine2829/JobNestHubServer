// app.js
const express = require('express');
const apiRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
