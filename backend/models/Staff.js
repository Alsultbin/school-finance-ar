const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'admin', 'accountant', 'principal', 'other'],
        required: true
    },
    department: String,
    qualification: String,
    experience: Number,
    joiningDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        required: true
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        branch: String,
        ifscCode: String
    },
    contact: {
        phone: String,
        email: String,
        address: String,
        emergencyContact: {
            name: String,
            relation: String,
            phone: String
        }
    },
    documents: [{
        type: String,
        name: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
});

module.exports = mongoose.model('Staff', StaffSchema); 