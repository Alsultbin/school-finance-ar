require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
const twilio = require('twilio');
const path = require('path');
const { Vonage } = require('@vonage/server-sdk');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_finance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Fee = require('./models/Fee');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');

// Twilio configuration
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Vonage (WhatsApp) configuration
const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

// Remove authentication middleware
app.use((req, res, next) => {
    next();
});

// Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        if (!username || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', username);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Student routes
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().populate('class');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Fee routes
app.get('/api/fees', async (req, res) => {
    try {
        const fees = await Fee.find().populate('student');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/fees', async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Payment routes
app.post('/api/payments', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        
        // Update fee status
        const fee = await Fee.findById(req.body.fee);
        if (fee) {
            fee.status = 'paid';
            await fee.save();
        }

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Notification routes
app.post('/api/notifications/send', async (req, res) => {
    try {
        const { type, recipients, message } = req.body;
        
        // Send notifications
        const results = await Promise.all(recipients.map(async (recipient) => {
            try {
                if (type === 'whatsapp') {
                    await vonage.messages.send({
                        from: process.env.VONAGE_WHATSAPP_NUMBER,
                        to: recipient,
                        text: message
                    });
                } else if (type === 'sms') {
                    await twilioClient.messages.create({
                        body: message,
                        to: recipient,
                        from: process.env.TWILIO_PHONE_NUMBER
                    });
                }
                
                return { recipient, status: 'success' };
            } catch (error) {
                return { recipient, status: 'failed', error: error.message };
            }
        }));

        // Save notification record
        const notification = new Notification({
            type,
            message,
            recipients,
            results
        });
        await notification.save();

        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for sending SMS and WhatsApp messages
app.post('/api/send-sms', async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await twilioClient.messages.create({
            body: message,
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        res.json({ success: true, message: 'SMS sent successfully', sid: result.sid });
    } catch (error) {
        console.error('SMS sending error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/send-whatsapp', async (req, res) => {
    try {
        const { to, message } = req.body;
        const result = await vonage.messages.send({
            from: process.env.VONAGE_WHATSAPP_NUMBER,
            to: to,
            text: message
        });
        res.json({ success: true, message: 'WhatsApp message sent successfully', result });
    } catch (error) {
        console.error('WhatsApp sending error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/send-bulk-messages', async (req, res) => {
    try {
        const { recipients, message, type } = req.body;
        const results = [];
        
        for (const recipient of recipients) {
            if (type === 'sms') {
                const result = await twilioClient.messages.create({
                    body: message,
                    to: recipient,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                results.push({ recipient, success: true, sid: result.sid });
            } else if (type === 'whatsapp') {
                const result = await vonage.messages.send({
                    from: process.env.VONAGE_WHATSAPP_NUMBER,
                    to: recipient,
                    text: message
                });
                results.push({ recipient, success: true, result });
            }
        }
        
        res.json({ success: true, results });
    } catch (error) {
        console.error('Bulk message sending error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});