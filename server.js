require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Arabic Data Models
const StudentSchema = new mongoose.Schema({
  الاسم: String,
  الصف: String,
  الهاتف: String,
  الرسوم_المدفوعة: Number,
  الرصيد_المتبقي: Number
});

const StaffSchema = new mongoose.Schema({
  الاسم: String,
  الوظيفة: String,
  الراتب: Number,
  الحساب_البنكي: String
});

const Student = mongoose.model('Student', StudentSchema);
const Staff = mongoose.model('Staff', StaffSchema);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('الرجاء تسجيل الدخول');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).send('جلسة غير صالحة');
  }
};

// CSV Import Endpoint
app.post('/api/import/students', authenticate, (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ خطأ: 'لم يتم تحميل الملف' });
  }

  const results = [];
  fs.createReadStream(req.files.file.tempFilePath)
    .pipe(csv())
    .on('data', (data) => results.push({
      الاسم: data['الاسم'],
      الصف: data['الصف'],
      الهاتف: data['الهاتف'],
      الرسوم_المدفوعة: parseFloat(data['الرسوم المدفوعة']),
      الرصيد_المتبقي: parseFloat(data['الرصيد المتبقي'])
    }))
    .on('end', () => {
      Student.insertMany(results)
        .then(() => res.json({ نجاح: true, عدد: results.length }))
        .catch(err => res.status(500).json({ خطأ: 'فشل الاستيراد' }));
    });
});

// WhatsApp Notification
app.post('/api/send-notification', authenticate, async (req, res) => {
  const { phone, message } = req.body;
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_NUMBER}`,
      to: `whatsapp:${phone}`
    });
    res.json({ نجاح: true });
  } catch (err) {
    res.status(500).json({ خطأ: 'فشل إرسال الإشعار' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`الخادم يعمل على المنفذ ${PORT}`));