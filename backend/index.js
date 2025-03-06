require("dotenv").config();
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/authRouter.js");

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log("Connected to the server!", port));
  })
  .catch((err) => console.log(err));
