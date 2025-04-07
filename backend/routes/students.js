const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { check, validationResult } = require('express-validator');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Add a new student
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('grade', 'Grade is required').not().isEmpty(),
  check('section', 'Section is required').not().isEmpty(),
  check('admissionNumber', 'Admission Number is required').not().isEmpty(),
  check('gender', 'Gender is required').not().isEmpty(),
  check('parent', 'Parent name is required').not().isEmpty(),
  check('contact', 'Contact is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('address', 'Address is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Admission Number already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Bulk import students
router.post('/bulk', async (req, res) => {
  try {
    const students = req.body;
    
    // Validate each student
    const errors = students.map(student => {
      const errors = [];
      if (!student.name) errors.push('Name is required');
      if (!student.grade) errors.push('Grade is required');
      if (!student.section) errors.push('Section is required');
      if (!student.admissionNumber) errors.push('Admission Number is required');
      if (!student.gender) errors.push('Gender is required');
      if (!student.parent) errors.push('Parent name is required');
      if (!student.contact) errors.push('Contact is required');
      if (!student.email) errors.push('Email is required');
      if (!student.address) errors.push('Address is required');
      
      return { student, errors };
    });

    // Filter out invalid students
    const validStudents = errors.filter(e => e.errors.length === 0).map(e => e.student);
    const invalidStudents = errors.filter(e => e.errors.length > 0);

    if (validStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid students found in the import',
        errors: invalidStudents.map(e => ({
          admissionNumber: e.student.admissionNumber,
          errors: e.errors
        }))
      });
    }

    // Save valid students
    const savedStudents = await Student.insertMany(validStudents);

    res.status(201).json({
      success: true,
      message: `${savedStudents.length} students imported successfully`,
      data: savedStudents,
      invalidStudents: invalidStudents.map(e => ({
        admissionNumber: e.student.admissionNumber,
        errors: e.errors
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
