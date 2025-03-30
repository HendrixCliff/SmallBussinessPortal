const express = require("express");
const dotenv = require("dotenv");
const passport = require("./passportConfig");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

const app = express();
const rateLimit = require("express-rate-limit");

// 🚀 Rate Limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000,
  max: 10,
  message: "Please come back tomorrow",
});

app.use(limiter);
app.use(require("helmet")());

// 🌍 Allowed Origins (for development & production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://small-business-portal-frontend.vercel.app",
];

// ✅ CORS Middleware (Fixes Array Issue)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS BLOCKED: ${origin}`);
        callback(new Error("CORS not allowed for this origin"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
  })
);

// ✅ Handle CORS Preflight Requests Correctly
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  return res.sendStatus(403);
});

// ✅ Debug Incoming Requests
app.use((req, res, next) => {
  console.log("Incoming Request Origin:", req.headers.origin);
  next();
});

// ✅ Middleware Order: CORS → Body Parsers → Sessions → Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// ✅ Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const globalErrorHandler = require("./controllers/errorController");
const CustomError = require("./Utils/CustomError");
const productVideoRoute = require("./routes/productVideoRoutes");
const deleteProductRoute = require("./routes/deleteAndUpdateProductRoute");
const messageRoute = require("./routes/messageRoutes");
const sectionRoute = require("./routes/sectionRoute");
const orderRoute = require("./routes/orderRoute");
const transferRoute = require("./routes/transferRoute");

// ✅ Apply Routes (Fixed Section Route)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/videos", productVideoRoute);
app.use("/api/v1/products/", deleteProductRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/sections", sectionRoute); 
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/transfer", transferRoute);


app.get("/", (req, res) => res.send("Home Page"));


app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));


app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);


app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`Welcome, ${req.user.displayName}!`);
});


app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});


app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404));
});


app.use(globalErrorHandler);

module.exports = app;
