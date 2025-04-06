require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function initDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_finance', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin user exists
        const adminExists = await User.findOne({ username: 'admin' });
        
        if (!adminExists) {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            // Create admin user
            const admin = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                name: 'Administrator',
                email: 'admin@school.com',
                phone: ''
            });

            await admin.save();
            console.log('Admin user created successfully');
            console.log('Username: admin');
            console.log('Password: admin123');
        } else {
            console.log('Admin user already exists');
            // Update admin password if needed
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            adminExists.password = hashedPassword;
            await adminExists.save();
            console.log('Admin password updated');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB(); 