const express = require("express");
const dotenv = require("dotenv");
const passport = require("./passportConfig");
const cors = require("cors");


dotenv.config({ path: "./config.env" });

const app = express();

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({  windowMs: 5 * 60 * 60 * 1000 , max: 10, message: "Please come back tomorrow" });

app.use(limiter);
app.use(require('helmet')());



// ✅ Set up CORS BEFORE any routes or session middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
    credentials: true, // ✅ Required for cookies & authentication
  })
);

// ✅ Handle preflight requests properly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ✅ Middleware Order: CORS → Sessions → Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(passport.initialize());


// ✅ Custom Middleware
app.use((req, res, next) => {
  console.log("Custom Middleware");
  next();
});

// ✅ Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const globalErrorHandler = require("./controllers/errorController");
const CustomError = require("./Utils/CustomError");
const productVideoRoute = require("./routes/productVideoRoutes");
const deleteProductRoute = require("./routes/deleteAndUpdateProductRoute");
const messageRoute = require("./routes/messageRoutes");
const sectionRoute = require("./routes/sectionRoute")
const orderRoute = require("./routes/orderRoute")
const transferRoute = require("./routes/transferRoute")

// ✅ Apply Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/videos", productVideoRoute);
app.use("/api/v1/products/", deleteProductRoute);
app.use("/api/v1/messages", messageRoute);
app.use("api/v1/sections", sectionRoute)
app.use("/api/v1/orders", orderRoute)
app.use("/api/v1/transfer", transferRoute)

// 🌍 Test Route
app.get("/", (req, res) => res.send("Home Page"));

// 🏆 Google OAuth Login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google OAuth Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

// 🔒 Protected Route (Only for Authenticated Users)
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`Welcome, ${req.user.displayName}!`);
});

// 🚪 Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// 🛑 Handle Undefined Routes
app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// 🔥 Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
