import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';
import ImportExport from '../components/students/ImportExport';
import BulkActions from '../components/students/BulkActions';

const Students = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setSelectedStudents([]);
        setSelectAll(false);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setNotification({
        type: 'error',
        message: translate('error_fetching_students')
      });
    }
  };

  const handleSendNotification = async (student) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'whatsapp',
          recipients: [student.phone],
          message: `${translate('dear')} ${student.name}, ${translate('fee_payment_reminder_message')}`
        })
      });

      if (response.ok) {
        setNotification({
          type: 'success',
          message: translate('notification_sent_success')
        });
      } else {
        throw new Error(translate('failed_to_send_notification'));
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleImportSuccess = async (importResult) => {
    try {
      // Add imported students to existing students
      const newStudents = [...students, ...importResult.data];
      setStudents(newStudents);
      
      // Update the backend with new students
      const response = await fetch(`${API_URL}/api/students/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importResult.data)
      });

      if (!response.ok) {
        throw new Error('Failed to save students to server');
      }
    } catch (error) {
      console.error('Error saving imported students:', error);
      setNotification({
        type: 'error',
        message: translate('failed_to_save_students')
      });
    }
  };
  
  const toggleStudentSelection = (student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s._id === student._id);
      if (isSelected) {
        return prev.filter(s => s._id !== student._id);
      } else {
        return [...prev, student];
      }
    });
  };
  
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...students]);
    }
    setSelectAll(!selectAll);
  };

  const clearNotification = () => {
    setNotification({ type: '', message: '' });
  };

  return (
    <Layout>
      <div className="py-6" dir={direction}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">{translate('students')}</h1>
          
          {notification.message && (
            <div className={`mt-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {notification.message}
              <button 
                onClick={clearNotification}
                className="ml-2 text-sm font-medium"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="mt-6 space-y-6">
            <ImportExport onImportSuccess={handleImportSuccess} />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">{translate('select_all')}</span>
              </div>
              
              <BulkActions 
                selectedStudents={selectedStudents} 
                onSuccess={() => {
                  setNotification({
                    type: 'success',
                    message: translate('bulk_action_success')
                  });
                }}
              />
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {/* Selection column */}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('name')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('class')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('phone')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('paid_amount')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('remaining_amount')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translate('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.some(s => s._id === student._id)}
                          onChange={() => toggleStudentSelection(student)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 ltr-text">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.paidAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.remainingAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {translate('view_details')}
                        </button>
                        <button
                          onClick={() => handleSendNotification(student)}
                          className="text-green-600 hover:text-green-900"
                        >
                          {translate('send_reminder')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" dir={direction}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {translate('student_details')}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {translate('name')}: {selectedStudent.name}
                </p>
                <p className="text-sm text-gray-500">
                  {translate('class')}: {selectedStudent.class}
                </p>
                <p className="text-sm text-gray-500">
                  {translate('phone')}: <span className="ltr-text">{selectedStudent.phone}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {translate('paid_amount')}: {selectedStudent.paidAmount}
                </p>
                <p className="text-sm text-gray-500">
                  {translate('remaining_amount')}: {selectedStudent.remainingAmount}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {translate('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Students;
