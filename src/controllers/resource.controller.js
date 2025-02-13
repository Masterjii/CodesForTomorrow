// src/controllers/resource.controller.js
const Resource = require('../models/Resource');

// Create a new resource
const createResource = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const resource = new Resource({ name, description });
    await resource.save();

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    next(error);
  }
};

// List all resources
const listResources = async (req, res, next) => {
  try {
    const resources = await Resource.find();
    res.status(200).json({ resources });
  } catch (error) {
    next(error);
  }
};

// Update a resource (existing implementation)
const updateResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const { name, description } = req.body;
    
    // Find and update the resource
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Broadcast the updated resource to clients listening in a room "resource_<id>"
    const io = req.app.get('io');
    io.to(`resource_${resourceId}`).emit('resourceUpdated', updatedResource);
    
    res.status(200).json({
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource,
  listResources,
  updateResource
};
