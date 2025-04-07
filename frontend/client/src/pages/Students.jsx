import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';
import ImportExport from '../components/students/ImportExport';
import BulkActions from '../components/students/BulkActions';
import AddStudentForm from '../components/students/AddStudentForm';
import { Table, message, Modal, Button, Space, notification } from 'antd';
import '../styles/students.css';

const Students = () => {
  const { translate } = useContext(LanguageContext);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array means this runs only once on mount

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/students`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
      setSelectedStudents([]);
      message.success(translate('students_loaded_successfully'));
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
      message.error(error.message || translate('error_fetching_students'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (student) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add student');
      }

      const newStudent = await response.json();
      setStudents(prev => [newStudent, ...prev]);
      notification.success({
        message: translate('success'),
        description: translate('student_added_successfully'),
        duration: 3
      });
    } catch (error) {
      console.error('Error adding student:', error);
      notification.error({
        message: translate('error'),
        description: error.message || translate('failed_to_add_student'),
        duration: 3
      });
    } finally {
      setLoading(false);
      setShowAddStudent(false);
    }
  };

  const handleImportSuccess = async (importResult) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/students/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importResult)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to import students');
      }

      const result = await response.json();
      if (result.invalidStudents && result.invalidStudents.length > 0) {
        notification.warning({
          message: translate('warning'),
          description: `${result.invalidStudents.length} ${translate('students_have_errors')}`,
          duration: 5
        });
      }

      setStudents(prev => [...prev, ...result.data]);
      notification.success({
        message: translate('success'),
        description: `${result.data.length} ${translate('students_imported_successfully')}`,
        duration: 3
      });
    } catch (error) {
      console.error('Error importing students:', error);
      notification.error({
        message: translate('error'),
        description: error.message || translate('failed_to_import_students'),
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/reports/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: selectedStudents,
          type: type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_report.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      notification.success({
        message: translate('success'),
        description: translate('report_generated_successfully'),
        duration: 3
      });
    } catch (error) {
      console.error('Error generating report:', error);
      notification.error({
        message: translate('error'),
        description: error.message || translate('failed_to_generate_report'),
        duration: 3
      });
    } finally {
      setLoading(false);
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
      title: translate('gender'),
      dataIndex: 'gender',
      key: 'gender'
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
      title: translate('email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: translate('address'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: translate('fees_status'),
      dataIndex: 'fees',
      key: 'fees',
      render: (fees) => (
        <span style={{ 
          color: fees === 'Paid' ? '#52c41a' : 
                 fees === 'Partial' ? '#faad14' : 
                 '#ff4d4f'
        }}>
          {fees}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="page-container">
        <h1>{translate('students')}</h1>
        
        <div className="students-header">
          <Space>
            <Button type="primary" onClick={() => setShowAddStudent(true)}>
              {translate('add_student')}
            </Button>
            <ImportExport onImportSuccess={handleImportSuccess} />
            <BulkActions
              selectedStudents={selectedStudents}
              onGenerateReport={handleGenerateReport}
            />
          </Space>
        </div>

        <div className="students-table">
          <Table
            columns={columns}
            dataSource={students}
            rowSelection={{
              selectedRowKeys: selectedStudents.map(s => s._id),
              onChange: (selectedRowKeys) => {
                setSelectedStudents(students.filter(s => selectedRowKeys.includes(s._id)));
              }
            }}
            pagination={{
              pageSize: 10
            }}
            loading={loading}
          />
        </div>

        {showAddStudent && (
          <Modal
            title={translate('add_student')}
            visible={showAddStudent}
            onCancel={() => setShowAddStudent(false)}
            footer={null}
          >
            <AddStudentForm onAdd={handleAddStudent} onClose={() => setShowAddStudent(false)} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Students;
