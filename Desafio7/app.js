const express = require("express");
// require the knex package
const knex = require("knex");

var handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});
const PORT = process.env.PORT || 8080
const routes = require("./api/routes");
const path = require("path");
const Container = require("./utils/classes/Container");
const container = new Container(path);
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("public"));
app.use("/static", express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("add.hbs");
});

io.on("connection", (socket) => {
  socket.on("add product", (msg) => {
    io.emit("add product", msg);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

app.get("/products", async (req, res) => {
  res.render("index.hbs", { products: await container.getAllItems() });
});

app.use("/api", routes);

// Listen on port 8080
http.listen(PORT, () => {
  console.log("Server run on port" + PORT );
});
