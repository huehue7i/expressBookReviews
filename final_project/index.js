const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Get token from session
    const token = req.session.token;

    if (token) {
        // Verify JWT token
        jwt.verify(token, "fingerprint_customer", (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = decoded; // Attach decoded token data to request
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
