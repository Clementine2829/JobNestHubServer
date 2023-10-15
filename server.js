const express = require('express');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const errorHandler = require("./middleware/errorHandling");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', companyRoutes);


app.all('*', (req, res, next) => {
  res.status(404);
  throw new Error("Not found");
});


app.use(errorHandler);

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
