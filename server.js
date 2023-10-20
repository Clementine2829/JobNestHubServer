const express = require('express');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require("./middleware/errorHandling");
const { constants } = require('./middleware/constants');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);

app.all('*', (req, res, next) => {
  res.status(constants.NOT_FOUND);
  throw new Error("Not found");
});

app.use(errorHandler);

// Use the error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
