const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", false);

const app = require('./app');

const PORT = process.env.PORT || 3001;

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })

    const schema = mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
      }
    );

    const Contact = mongoose.model("contact", schema);
     

  } catch (error) {
    console.error("Error connecting to Database", error.message);
    process.exit(1);
  }
}

main();