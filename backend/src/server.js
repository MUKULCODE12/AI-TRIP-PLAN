const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const tripRoutes = require("./routes/tripRoutes");



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Trip Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;
app.use("/api/trips", tripRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});