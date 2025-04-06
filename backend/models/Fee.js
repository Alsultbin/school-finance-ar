const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true,
        enum: ['Term 1', 'Term 2', 'Term 3', 'Annual']
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'partial', 'overdue'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: function() {
            return this.amount;
        }
    },
    discount: {
        type: Number,
        default: 0
    },
    fine: {
        type: Number,
        default: 0
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update remaining amount when paid amount changes
FeeSchema.pre('save', function(next) {
    this.remainingAmount = this.amount - this.paidAmount - this.discount + this.fine;
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Fee', FeeSchema); 