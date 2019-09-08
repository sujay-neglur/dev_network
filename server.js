const express = require("express");
const app = express();
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const db = `mongodb://${process.env.db_user}:${process.env.db_password}@${process.env.host}/${process.env.database}`;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Passport middleware
app.use(cors());
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);


app.listen(port, () => console.log("Server started"));
