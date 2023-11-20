const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require("./middleware/errorHandling");
const { constants } = require('./middleware/constants');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 5000;

// Allow requests from 'http://localhost:3000'
app.use(cors({ origin: 'http://localhost:3000' }));


// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');
// app.use((req, res, next) => {
//   logger.info(`[${req.method}] ${req.url}`);
//   next();
// });
app.all('*', (req, res, next) => {
  console.log(req.url)
  next()
});

app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);

app.all('*', (req, res, next) => {
  console.log(req.url)
  res.status(constants.NOT_FOUND);
  throw new Error("Not found");
});

app.use(errorHandler);

// Use the error handling middleware
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
