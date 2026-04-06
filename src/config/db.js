const mongoose = require("mongoose");

const { mongoDbName, mongoDbUri } = require("./env");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoDbUri, {
      dbName: mongoDbName,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
};
