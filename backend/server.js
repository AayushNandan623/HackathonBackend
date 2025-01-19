const express = require("express");
require("dotenv").config(); 
const connectDB = require("./config/dbConnection.js"); 

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
