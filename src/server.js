const app = require("./app");
const { connectToDatabase } = require("./config/db");
const { port } = require("./config/env");

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start server", error.message);
    process.exit(1);
  }
};

startServer();
