const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Connected to mongodb!");
  } catch (error) {
    console.error("Error while connecting to mongodb", error.message);
    process.exit(1);
  }
}

main();