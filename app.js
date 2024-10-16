require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const app = express();

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// routers
const adminRouter = require("./routes/admin");
const doctorRouter = require("./routes/doctor");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

app.use(express.json());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1", adminRouter);
app.use("/api/v1/doctor", auth, doctorRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("doctor appointment management system testing");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is up and listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
