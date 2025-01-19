const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AddUser = require("./routes/AddUser.js");
const AutoPay = require("./routes/AutoPay.js");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/Devhacks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", AddUser);
app.use("/api", AutoPay);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
