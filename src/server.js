const express = require("express");
const bodyParser = require("body-parser");
const configViewEngine = require("./config/viewEngine");
const initWebRoutes = require("./route/web");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const cookieSession = require("cookie-session");
// const passportStrategy = require("./middleWare/LoginWithGoogle");
require("dotenv").config();

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 },
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

configViewEngine(app);
initWebRoutes(app);

connectDB();
// app.listen();
const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
