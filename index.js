const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./src/constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
// const path = require("path");

// import passport middleware
require("./src/middlewares/passport-middleware");

// initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// import routes
const donatorRoutes = require("./src/routes/user_auth");
const ambassadorRoutes = require("./src/routes/ambassador");
const campaignRoutes = require("./src/routes/campaign");
const blogRoutes = require("./src/routes/blog");
const eventRoutes = require("./src/routes/event");

// initialize routes
app.use("/api/user", donatorRoutes);
app.use("/api/ambassador", ambassadorRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/event", eventRoutes);

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
