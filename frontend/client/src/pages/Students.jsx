import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';
import ImportExport from '../components/students/ImportExport';
import BulkActions from '../components/students/BulkActions';
import { Table, message } from 'antd';
import '../styles/students.css';

const Students = () => {
  const { translate, direction } = useContext(LanguageContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array means this runs only once on mount

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
      message.error(translate('error_fetching_students'));
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
        message.success(translate('notification_sent_success'));
      } else {
        throw new Error(translate('failed_to_send_notification'));
      }
    } catch (error) {
      message.error(error.message);
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
      
      message.success(translate('students_imported_successfully'));
    } catch (error) {
      console.error('Error saving imported students:', error);
      message.error(translate('failed_to_save_students'));
    }
  };

  const toggleStudentSelection = (student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s._id === student._id);
      if (isSelected) {
        return prev.filter(s => s._id !== student._id);
      }
      return [...prev, student];
    });
  };

  const handleSelectAll = (selected) => {
    setSelectAll(selected);
    if (selected) {
      setSelectedStudents(students);
    } else {
      setSelectedStudents([]);
    }
  };

  const columns = [
    {
      title: translate('name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(record)}>
          {text}
        </div>
      )
    },
    {
      title: translate('grade'),
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: translate('section'),
      dataIndex: 'section',
      key: 'section'
    },
    {
      title: translate('admission_number'),
      dataIndex: 'admissionNumber',
      key: 'admissionNumber'
    },
    {
      title: translate('parent'),
      dataIndex: 'parent',
      key: 'parent'
    },
    {
      title: translate('contact'),
      dataIndex: 'contact',
      key: 'contact'
    },
    {
      title: translate('fees_status'),
      dataIndex: 'fees',
      key: 'fees',
      render: (fees) => (
        <span style={{ color: fees === 'Paid' ? '#52c41a' : '#faad14' }}>
          {fees}
        </span>
      )
    },
    {
      title: translate('actions'),
      key: 'actions',
      render: (_, record) => (
        <div>
          <button
            onClick={() => handleSendNotification(record)}
            className="action-btn"
          >
            {translate('send_reminder')}
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="page-container">
        <h1>{translate('students')}</h1>
        
        <div className="students-header">
          <ImportExport onImportSuccess={handleImportSuccess} />
          <BulkActions
            selectedStudents={selectedStudents}
            onSendNotifications={handleSendNotification}
          />
        </div>

        <div className="students-table">
          <Table
            columns={columns}
            dataSource={students}
            rowSelection={{
              selectedRowKeys: selectedStudents.map(s => s._id),
              onChange: (selectedRowKeys) => {
                setSelectedStudents(students.filter(s => selectedRowKeys.includes(s._id)));
              },
              onSelectAll: handleSelectAll
            }}
            pagination={{
              pageSize: 10
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Students;
