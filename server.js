const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const port = process.env.PORT || 5000;

app.use(morgan("dev"));

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static(path.join(__dirname, "/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build/index.html"));
  });
}

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});
