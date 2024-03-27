// backend/routes/index.js
const express = require('express');
const router = express.Router();

// Add a XSRF-TOKEN cookie
router.get('/api/csrf/restore', async(req, res) => {

})

module.exports = router;
