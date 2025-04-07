const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { check, validationResult } = require('express-validator');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Add a new staff member
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('employeeNumber', 'Employee Number is required').not().isEmpty(),
  check('department', 'Department is required').not().isEmpty(),
  check('position', 'Position is required').not().isEmpty(),
  check('gender', 'Gender is required').not().isEmpty(),
  check('contact', 'Contact is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('address', 'Address is required').not().isEmpty(),
  check('salary', 'Salary is required').not().isEmpty(),
  check('salary', 'Salary must be a number').isNumeric(),
  check('status', 'Status is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Employee Number already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update staff member
router.put('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    res.json({ success: true, data: staff });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete staff member
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await staff.remove();
    res.json({ success: true, message: 'Staff removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
