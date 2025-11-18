const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      const updateData = { ...req.body };
      
      if (req.file) {
        updateData.logo = `/uploads/${req.file.filename}`;
      }
      
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true }
      );
    }
    
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
