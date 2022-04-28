const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080
const routes = require("./api/routes");
const path = "./text.json";
const Container = require("./utils/classes/Container");
const container = new Container(path);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

// Create Express App

app.get("/", (req, res) => {
  res.render("add.ejs");
});

app.get("/products", async (req, res) => {
  res.render("index.ejs", { products: await container.getAllItems() });
});

app.use("/api", routes);

// Listen on port 8080
app.listen(PORT, () => {
  console.log("Server run on port" + PORT );
});
