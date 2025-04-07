import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { FaWhatsapp, FaUsers, FaUserCheck, FaFileDownload } from 'react-icons/fa';

const WhatsAppMessaging = ({ students = [] }) => {
  const { translate, direction } = useContext(LanguageContext);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('payment_reminder');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Sample message templates
  const templates = {
    payment_reminder: translate('payment_reminder_template'),
    attendance_alert: translate('attendance_alert_template'),
    event_notification: translate('event_notification_template'),
    exam_schedule: translate('exam_schedule_template')
  };

  // Sample student data if none provided
  const defaultStudents = [
    { id: 1, name: 'Ahmed Ali', grade: '10th', parent: 'Mohammed Ali', contact: '+971501234567', fees: 'Pending' },
    { id: 2, name: 'Fatima Hassan', grade: '9th', parent: 'Hassan Khan', contact: '+971552345678', fees: 'Pending' },
    { id: 3, name: 'Omar Farooq', grade: '11th', parent: 'Farooq Ahmed', contact: '+971523456789', fees: 'Paid' },
    { id: 4, name: 'Aisha Rahman', grade: '10th', parent: 'Rahman Shah', contact: '+971544567890', fees: 'Partial' },
  ];

  const studentsToUse = students.length > 0 ? students : defaultStudents;
  
  // Select/deselect all students
  const toggleSelectAll = () => {
    if (selectedStudents.length === studentsToUse.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsToUse.map(s => s.id));
    }
  };

  // Toggle selection of a student
  const toggleStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  // Update message when template changes
  useEffect(() => {
    setMessage(templates[messageTemplate] || '');
  }, [messageTemplate]);

  // Send WhatsApp messages
  const sendWhatsAppMessages = async () => {
    if (selectedStudents.length === 0 || !message.trim()) {
      setNotification({
        show: true,
        type: 'error',
        message: translate('select_students_and_message')
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get selected student data
      const recipients = studentsToUse.filter(s => selectedStudents.includes(s.id));
      
      // For each recipient, open WhatsApp link in a new tab
      // In a real app, this would call an API for bulk messaging
      for (const student of recipients) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${student.contact.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappLink, '_blank');
        
        // Small delay between opening tabs to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setNotification({
        show: true,
        type: 'success',
        message: translate('messages_sent_successfully')
      });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: translate('failed_to_send_messages')
      });
    } finally {
      setLoading(false);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    }
  };

  // Filter students for those with pending payments
  const filterPendingPayments = () => {
    const pendingIds = studentsToUse
      .filter(s => s.fees === 'Pending' || s.fees === 'Partial')
      .map(s => s.id);
    
    setSelectedStudents(pendingIds);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5" dir={direction}>
      <h2 className="text-xl font-bold mb-5 flex items-center">
        <FaWhatsapp className="text-green-600 mr-2" />
        {translate('whatsapp_messaging')}
      </h2>
      
      {notification.show && (
        <div className={`p-3 mb-4 rounded-md ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('message_template')}
        </label>
        <select
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="payment_reminder">{translate('payment_reminder')}</option>
          <option value="attendance_alert">{translate('attendance_alert')}</option>
          <option value="event_notification">{translate('event_notification')}</option>
          <option value="exam_schedule">{translate('exam_schedule')}</option>
        </select>
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {translate('message')}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={translate('type_your_message')}
        ></textarea>
      </div>
      
      <div className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">{translate('select_recipients')}</h3>
          <div className="flex space-x-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <FaUsers className="mr-1" size={12} />
              {selectedStudents.length === studentsToUse.length 
                ? translate('deselect_all') 
                : translate('select_all')}
            </button>
            <button
              onClick={filterPendingPayments}
              className="flex items-center text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
            >
              <FaUserCheck className="mr-1" size={12} />
              {translate('filter_pending_payments')}
            </button>
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === studentsToUse.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translate('student')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translate('parent')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translate('contact')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translate('fees_status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsToUse.map((student) => (
                <tr key={student.id} className={selectedStudents.includes(student.id) ? 'bg-indigo-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.parent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.fees === 'Paid' ? 'bg-green-100 text-green-800' : 
                        student.fees === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-purple-100 text-purple-800'}`}>
                      {student.fees}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedStudents.length} {translate('students_selected')}
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setSelectedStudents([])}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {translate('clear')}
          </button>
          <button
            type="button"
            onClick={sendWhatsAppMessages}
            disabled={loading || selectedStudents.length === 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
              ${loading || selectedStudents.length === 0 ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            <FaWhatsapp className="mr-2" />
            {loading ? translate('sending') : translate('send_whatsapp_messages')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessaging;
