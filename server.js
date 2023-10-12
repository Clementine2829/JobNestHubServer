const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./middleware/errorHandling");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1', userRoutes);
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
