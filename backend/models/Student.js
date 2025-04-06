const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    fatherName: String,
    motherName: String,
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    address: String,
    phone: String,
    email: String,
    emergencyContact: {
        name: String,
        relation: String,
        phone: String
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated'],
        default: 'active'
    },
    photo: String,
    documents: [{
        type: String,
        name: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    notes: String
});

module.exports = mongoose.model('Student', StudentSchema); 