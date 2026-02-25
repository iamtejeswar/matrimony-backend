const express = require('express');
const router = express.Router();
const admin = require('../config/firebase'); // Import your config

router.post("/phone-login", async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. Success! Return user data to frontend
    res.status(200).json({
      success: true,
      message: "Backend Verified User! 🚀",
      phone: decodedToken.phone_number,
      uid: decodedToken.uid
    });

  } catch (error) {
    console.error("Token Error:", error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
});

module.exports = router;