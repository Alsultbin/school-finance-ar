import React, { useState } from 'react';
import { Button, Table, Space, message } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { exportToExcel, exportToPDF } from '../../utils/mockDataHandler';
import { useTranslation } from '../../contexts/TranslationContext';

const Students = () => {
  const { students, setStudents } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    try {
      setLoading(true);
      const result = await exportStudents(format, students);
      if (result.success) {
        message.success(`Successfully exported ${result.count} students`);
      } else {
        message.error('Failed to export students');
      }
    } catch (error) {
      message.error('Error exporting students');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (file) => {
    try {
      importStudents(file).then(result => {
        if (result.success) {
          setStudents(result.data);
          message.success(`Successfully imported ${result.count} students`);
        } else {
          message.error(result.error);
        }
      });
    } catch (error) {
      message.error('Error importing students');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
    { title: 'Section', dataIndex: 'section', key: 'section' },
    { title: 'Admission #', dataIndex: 'admissionNumber', key: 'admissionNumber' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Parent', dataIndex: 'parent', key: 'parent' },
    { title: 'Contact', dataIndex: 'contact', key: 'contact' },
    { title: 'Fees Status', dataIndex: 'fees', key: 'fees' },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Students</h2>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {/* TODO: Add new student */}}
          >
            Add New Student
          </Button>
          <Button 
            type="default" 
            icon={<DownloadOutlined />} 
            onClick={() => handleExport('excel')}
            loading={loading}
          >
            Export Excel
          </Button>
          <Button 
            type="default" 
            icon={<DownloadOutlined />} 
            onClick={() => handleExport('pdf')}
            loading={loading}
          >
            Export PDF
          </Button>
        </Space>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={students} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Students;
