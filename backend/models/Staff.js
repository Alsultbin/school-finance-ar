const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add staff name'],
    trim: true
  },
  employeeNumber: {
    type: String,
    required: [true, 'Please add employee number'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Please add department'],
    enum: ['Teaching', 'Admin', 'Support', 'Management']
  },
  position: {
    type: String,
    required: [true, 'Please add position']
  },
  gender: {
    type: String,
    required: [true, 'Please add gender'],
    enum: ['Male', 'Female']
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
  salary: {
    type: Number,
    required: [true, 'Please add salary']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Please add joining date']
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive', 'On Leave']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', staffSchema);