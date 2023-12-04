const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
// const path = require("path");

// import passport middleware
require("./middlewares/passport-middleware");

// initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// import routes
const donatorRoutes = require("./routes/donator_auth");
const embassadorRoutes = require("./routes/embassador");

// initialize routes
app.use("/api/donator", donatorRoutes);
app.use("/api/embassador", embassadorRoutes);
app.use("/", (req, res) => {
  console.log("Welcome to astronova");
});

// app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      SERVER_URL: process.env.SERVER_URL,
        console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error : ${error.message}`);
  }
};

appStart();
