const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a student name'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Please add a grade'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  section: {
    type: String,
    required: [true, 'Please add a section'],
    enum: ['A', 'B', 'C', 'D', 'E']
  },
  admissionNumber: {
    type: String,
    required: [true, 'Please add an admission number'],
    unique: true
  },
  gender: {
    type: String,
    required: [true, 'Please add gender'],
    enum: ['Male', 'Female']
  },
  parent: {
    type: String,
    required: [true, 'Please add parent name']
  },
  contact: {
    type: String,
    required: [true, 'Please add contact number']
  },
  email: {
    type: String,
    required: [true, 'Please add email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  address: {
    type: String,
    required: [true, 'Please add address']
  },
  fees: {
    type: String,
    default: 'Pending',
    enum: ['Paid', 'Pending', 'Partial']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);