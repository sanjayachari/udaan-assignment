const cookieParser = require("cookie-parser");
const { urlencoded } = require("express");
const express = require("express");
const app = express();
const cors = require('cors');
const { API1, API2 } = require("./constant/constant");

app.use(
  cors({
    origin: [API1, API2],
    credentials: true,
  })
);

// Log requests middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parse cookies
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log("Cookies:", req.cookies);
  next();
});

app.use(express.json());

// Parse URL-encoded bodies
app.use(urlencoded({ extended: true }));

// Database connection
require("./db/db");

// Routes
app.use("/server/v1", require("./routes/route"));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
