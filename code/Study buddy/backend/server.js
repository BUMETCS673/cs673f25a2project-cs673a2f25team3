const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const studyRoutes = require("./routes/studyRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/profiles", profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app; // for testing
