const express = require("express");
const PORT = process.env.PORT || 8080

// utils
const getRandomItem = require("./utils/functions");
const path = "./text.json";

// Import Class and Instantiate
const Container = require("./utils/classes/Container");
const container = new Container(path);

// Data from text.json
const data = container.getAllItems();

// Create Express App
const app = express();

// GET /products
app.get("/products", async (req, res) => {
  res.json(await data);
});
// GET /randomProduct
app.get("/randomProduct", async (req, res) => {
  res.json(getRandomItem(await data));
});

// Listen on port 8080
app.listen(PORT, () => {
  console.log("Server run on port" + PORT );
});
