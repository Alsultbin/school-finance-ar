import React, { useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

// Get API URL from environment variable or use localhost as fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [message, setMessage] = useState('');

  // CSV Import Handler
  const handleImport = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post('/api/import/students', formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('تم الاستيراد بنجاح');
    } catch (err) {
      alert('فشل الاستيراد');
    }
  };

  // Send WhatsApp Message
  const sendNotification = async (phone) => {
    try {
      await axios.post('/api/send-notification', {
        phone,
        message: `تنبيه: الرجاء سداد الرصيد المتبقي ${students.find(s => s.الهاتف === phone).الرصيد_المتبقي}`
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('تم إرسال الإشعار');
    } catch (err) {
      alert('فشل الإرسال');
    }
  };

  const get_ar_data = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ar-data`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data && response.data.data) {
        setStudents(response.data.data.students || []);
        setStaff(response.data.data.staff || []);
      } else {
        console.error('Invalid response structure:', response.data);
        setMessage('خطأ في تنسيق البيانات المستلمة');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('فشل في جلب البيانات');
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>نظام إدارة المدارس المالية</h1>

      <div className="import-section">
        <input type="file" onChange={handleImport} />
        <CSVLink 
          data={students}
          filename="الطلاب.csv"
          className="export-button"
        >
          تصدير البيانات
        </CSVLink>
      </div>

      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الصف</th>
            <th>الرصيد المتبقي</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.الاسم}</td>
              <td>{student.الصف}</td>
              <td>{student.الرصيد_المتبقي}</td>
              <td>
                <button onClick={() => sendNotification(student.الهاتف)}>
                  إرسال تذكير
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}