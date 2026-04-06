const swaggerUi = require("swagger-ui-express");

module.exports = {
  swaggerServeFiles: swaggerUi.serveFiles,
  swaggerGenerateHtml: swaggerUi.generateHTML,
};
