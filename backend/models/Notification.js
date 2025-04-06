const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['whatsapp', 'sms', 'email'],
        required: true
    },
    recipients: [{
        type: String,
        required: true
    }],
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    results: [{
        recipient: String,
        status: String,
        error: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema); 