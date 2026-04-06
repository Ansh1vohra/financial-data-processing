const express = require("express");

const router = express.Router();

router.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Finance Dashboard Backend is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
