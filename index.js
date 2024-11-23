require("dotenv").config(); 
const express = require("express");
const schoolRouter = require("./routes/schoolRoute"); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the School Management API!");
});


app.use("/api/schools", schoolRouter);


app.use((req, res) => {
  res.status(404).send({ error: "Route not found!" });
});


app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).send({ error: "Internal server error" });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
