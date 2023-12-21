const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorHandling");
const { constants } = require("./middleware/constants");
const logger = require("./logger");
const https = require("https");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

const privateKey = fs.readFileSync("./certificates/key.pem", "utf8");
const certificate = fs.readFileSync("./certificates/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use(cookieParser());
const corsOptions = {
  origin: "https://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');
// app.use((req, res, next) => {
//   logger.info(`[${req.method}] ${req.url}`);
//   next();
// });
app.all("*", (req, res, next) => {
  console.log("Received request:", req.method, req.url);
  console.log("Headers:", req.headers);
  next();
});

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.all("*", (req, res, next) => {
  console.log(req.url);
  res.status(constants.NOT_FOUND);
  throw new Error("Not found");
});

app.use(errorHandler);

// Use the error handling middleware
// app.use(errorHandler);

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
