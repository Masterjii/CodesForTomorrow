// src/models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
