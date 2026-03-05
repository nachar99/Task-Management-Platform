const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected successfully to: ${mongoose.connection.name}`);
  } catch (error) {
    console.log("failed to connect ", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
