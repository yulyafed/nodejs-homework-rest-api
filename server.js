const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require('./app');

dotenv.config();

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

