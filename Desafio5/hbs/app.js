const express = require("express");

var handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});

const PORT = process.env.PORT || 8080
const routes = require("./api/routes");
const path = "./text.json";
const Container = require("./utils/classes/Container");
const container = new Container(path);
const app = express();

app.use(express.static("public"));
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("add.hbs");
});

app.get("/products", async (req, res) => {
  res.render("index.hbs", { products: await container.getAllItems() });
});

app.use("/api", routes);

// Listen on port 8080
app.listen(PORT, () => {
  console.log("Server run on port" + PORT );
});


