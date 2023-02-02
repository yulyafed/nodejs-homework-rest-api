const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const app = require('./app');
const sgMail = require("@sendgrid/mail");

dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "js");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public/avatars")));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/", async (req, res, next) => {
  const { email, name, text } = req.body;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "YulyaFed86@gmail.com",
    subject: `Sending email from ${name}`,
    text
  };
  try {
    await sgMail.send(msg);
    res.render("done");
  } catch (err) {
    next(err);
  }
});

mongoose.set("strictQuery", false);

const PORT = process.env.PORT || 3001;

const { HOST_URI } = process.env;

(async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })

  } catch (error) {
    console.error("Error connecting to Database", error.message);
    process.exit(1);
  }
}());

