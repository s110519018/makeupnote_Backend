const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

// const MONGODB_ATLAS_URL = "mongodb+srv://test:test@cluster0.pten9.mongodb.net/MAKEUPNOTE?retryWrites=true&w=majority";
// const MONGODB_ATLAS_URL = "mongodb+srv://test:jApWjQzn3J4W93jE@cluster0.mb3uc.mongodb.net/AMAZONA?retryWrites=true&w=majority";
const makeupsRouter = require("./routers/makeupsRouter");
const methodsRouter = require("./routers/methodsRouter");
const userRouter = require("./routers/userRouter");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_ATLAS_URL, {
// mongoose.connect(MONGODB_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/makeups", makeupsRouter);
app.use("/api/methods", methodsRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
