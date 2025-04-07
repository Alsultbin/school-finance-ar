import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';
import { Table, message, Modal, Button, Space, notification, Form, Input, Select } from 'antd';
import '../styles/staff.css';

const Staff = () => {
  const { translate } = useContext(LanguageContext);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStaff();
  }, []); // Empty dependency array means this runs only once on mount

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/staff`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      setStaff(data);
      setSelectedStaff([]);
      message.success(translate('staff_loaded_successfully'));
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError(error.message);
      message.error(error.message || translate('error_fetching_staff'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add staff');
      }

      const newStaff = await response.json();
      setStaff(prev => [newStaff, ...prev]);
      notification.success({
        message: translate('success'),
        description: translate('staff_added_successfully'),
        duration: 3
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      notification.error({
        message: translate('error'),
        description: error.message || translate('failed_to_add_staff'),
        duration: 3
      });
    } finally {
      setLoading(false);
      setShowAddStaff(false);
      form.resetFields();
    }
  };

  const columns = [
    {
      title: translate('name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: translate('employee_number'),
      dataIndex: 'employeeNumber',
      key: 'employeeNumber'
    },
    {
      title: translate('department'),
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: translate('position'),
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: translate('gender'),
      dataIndex: 'gender',
      key: 'gender'
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
      title: translate('salary'),
      dataIndex: 'salary',
      key: 'salary',
      render: (salary) => `${salary} AED`
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'Active' ? '#52c41a' : 
                 status === 'On Leave' ? '#faad14' : 
                 '#ff4d4f'
        }}>
          {status}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="page-container">
        <h1>{translate('staff')}</h1>
        
        <div className="staff-header">
          <Space>
            <Button type="primary" onClick={() => setShowAddStaff(true)}>
              {translate('add_staff')}
            </Button>
          </Space>
        </div>

        <div className="staff-table">
          <Table
            columns={columns}
            dataSource={staff}
            rowSelection={{
              selectedRowKeys: selectedStaff.map(s => s._id),
              onChange: (selectedRowKeys) => {
                setSelectedStaff(staff.filter(s => selectedRowKeys.includes(s._id)));
              }
            }}
            pagination={{
              pageSize: 10
            }}
            loading={loading}
          />
        </div>

        {showAddStaff && (
          <Modal
            title={translate('add_staff')}
            visible={showAddStaff}
            onCancel={() => {
              setShowAddStaff(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddStaff}
            >
              <Form.Item
                name="name"
                label={translate('name')}
                rules={[{ required: true, message: translate('please_enter_name') }]}
              >
                <Input placeholder={translate('enter_name')} />
              </Form.Item>

              <Form.Item
                name="employeeNumber"
                label={translate('employee_number')}
                rules={[{ required: true, message: translate('please_enter_employee_number') }]}
              >
                <Input placeholder={translate('enter_employee_number')} />
              </Form.Item>

              <Form.Item
                name="department"
                label={translate('department')}
                rules={[{ required: true, message: translate('please_select_department') }]}
              >
                <Select placeholder={translate('select_department')}>
                  <Select.Option value="Teaching">{translate('teaching')}</Select.Option>
                  <Select.Option value="Admin">{translate('admin')}</Select.Option>
                  <Select.Option value="Support">{translate('support')}</Select.Option>
                  <Select.Option value="Management">{translate('management')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="position"
                label={translate('position')}
                rules={[{ required: true, message: translate('please_enter_position') }]}
              >
                <Input placeholder={translate('enter_position')} />
              </Form.Item>

              <Form.Item
                name="gender"
                label={translate('gender')}
                rules={[{ required: true, message: translate('please_select_gender') }]}
              >
                <Select placeholder={translate('select_gender')}>
                  <Select.Option value="Male">{translate('male')}</Select.Option>
                  <Select.Option value="Female">{translate('female')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="contact"
                label={translate('contact')}
                rules={[{ required: true, message: translate('please_enter_contact') }]}
              >
                <Input placeholder={translate('enter_contact')} />
              </Form.Item>

              <Form.Item
                name="email"
                label={translate('email')}
                rules={[
                  { required: true, message: translate('please_enter_email') },
                  { type: 'email', message: translate('invalid_email') }
                ]}
              >
                <Input placeholder={translate('enter_email')} />
              </Form.Item>

              <Form.Item
                name="address"
                label={translate('address')}
                rules={[{ required: true, message: translate('please_enter_address') }]}
              >
                <Input.TextArea placeholder={translate('enter_address')} />
              </Form.Item>

              <Form.Item
                name="salary"
                label={translate('salary')}
                rules={[{ required: true, message: translate('please_enter_salary') }]}
              >
                <Input placeholder={translate('enter_salary')} type="number" />
              </Form.Item>

              <Form.Item
                name="status"
                label={translate('status')}
                rules={[{ required: true, message: translate('please_select_status') }]}
              >
                <Select placeholder={translate('select_status')}>
                  <Select.Option value="Active">{translate('active')}</Select.Option>
                  <Select.Option value="Inactive">{translate('inactive')}</Select.Option>
                  <Select.Option value="On Leave">{translate('on_leave')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {translate('add_staff')}
                  </Button>
                  <Button onClick={() => {
                    setShowAddStaff(false);
                    form.resetFields();
                  }}>
                    {translate('cancel')}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Staff;
