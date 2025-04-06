const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    grade: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    capacity: {
        type: Number,
        default: 30
    },
    currentStrength: {
        type: Number,
        default: 0
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        periods: [{
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject'
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            startTime: String,
            endTime: String
        }]
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('Class', ClassSchema); 