require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
//DATABASE
const connectDB = require("./db/connectDB");

// IMPORT PRE MIDDLEWARES
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const expressLimiter = require("express-rate-limit");
const mongoSantization = require("express-mongo-sanitize");
const cors = require("cors");

// IMPORT ROUTEs
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");

// IMPORT POST MIDDLEWARES
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

// pre Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SIGN));
app.use(xss());
app.use(helmet());
app.use(mongoSantization());
app.use(
  expressLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

// post Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const listen = () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(PORT, console.log("Server is Up on Port " + PORT));
  } catch (error) {
    console.log("Server is crached");
  }
};

listen();
