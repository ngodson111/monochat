//IMPORTING PACKAGES
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");

//DB URL
const { mongoURL } = require("./config/key");

//DB CONNECTION
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("Connected To DataBase");
});
mongoose.connection.on("error", () => {
  console.log("Error Connecting To DataBase");
});

//MIDDLEWARE
app.use(express.json());

//STATIC FILE
app.use(express.static("./public"));

//SCHEMAS
require("./model/auth");

//ROUTES
app.use(require("./routes/auth"));

//LISTENING TO PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
