/*
  50% AI help with Swagger
  50% Human
*/

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const studyRoutes = require("./routes/studyRoutes");
const profileRoutes = require("./routes/profileRoutes");
const buddyRoutes = require("./routes/buddyRoutes")
const statsRoutes = require("./routes/statsRoutes")
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

// ======================
// Swagger setup
// ======================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Study Buddy API",
      version: "1.0.0",
      description: "API documentation for Study Buddy backend",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // <- Path to the API route files with swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ======================
// Routes
// ======================
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/buddy", buddyRoutes);
app.use("/api/stats", statsRoutes);

// listen Only listen when running server.js directly. Do not listen when testing
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📄 Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;