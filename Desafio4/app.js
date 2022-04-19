const express = require("express");
const PORT = process.env.PORT || 8080
const routes = require("./api/routes");
const bodyParser = require("body-parser");

// Create Express App
const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", routes);

// Listen on port 8080
app.listen(PORT, () => {
  console.log("Server run on port" + PORT );
});
