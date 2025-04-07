const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
const twilio = require('twilio');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_finance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Models
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Fee = require('./models/Fee');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error('No token provided');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('User not found');

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

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
app.get('/api/students', auth, async (req, res) => {
    try {
        const students = await Student.find().populate('class');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', auth, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Fee routes
app.get('/api/fees', auth, async (req, res) => {
    try {
        const fees = await Fee.find().populate('student');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/fees', auth, async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Payment routes
app.post('/api/payments', auth, async (req, res) => {
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
app.post('/api/notifications/send', auth, async (req, res) => {
    try {
        const { type, recipients, message } = req.body;
        
        // Initialize Twilio client
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Send notifications
        const results = await Promise.all(recipients.map(async (recipient) => {
            try {
                if (type === 'whatsapp') {
                    await client.messages.create({
                        body: message,
                        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                        to: `whatsapp:${recipient}`
                    });
                } else if (type === 'sms') {
                    await client.messages.create({
                        body: message,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: recipient
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

const studentsRouter = require('./routes/students');
const staffRouter = require('./routes/staff');
const reportsRouter = require('./routes/reports');

app.use('/api/students', studentsRouter);
app.use('/api/staff', staffRouter);
app.use('/api/reports', reportsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});