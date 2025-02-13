// src/routes/resource.routes.js
const express = require('express');
const { createResource, listResources, updateResource } = require('../controllers/resource.controller');
const { protect } = require('../middleware/auth.middleware'); // if you wish to secure these endpoints
const router = express.Router();

// Create a new resource
router.post('/createResources', protect, createResource);

// List all resources
router.get('/getResources', protect, listResources);

// Update an existing resource
router.put('/updateResources/:id', protect, updateResource);

module.exports = router;
