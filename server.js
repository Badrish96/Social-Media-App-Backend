const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverConfig = require("./configs/serverConfig");
const dbConfig = require("./configs/dbConfig");

const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect(dbConfig.DB_URL);

const db = mongoose.connection;

db.on("error", () => {
  console.log("Error while connecting to DB");
});

db.once("open", () => {
  console.log("Connected to Database");
});

//Routes
require("./Routes/AuthRoute")(app);
require("./Routes/AuthRoute")(app);
require("./Routes/UserRoutes")(app);
require("./Routes/postRoute")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Server started on PORT ${serverConfig.PORT}`);
});
