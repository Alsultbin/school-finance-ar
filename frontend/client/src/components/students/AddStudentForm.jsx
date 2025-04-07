import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';

const { Option } = Select;

const AddStudentForm = ({ onAdd }) => {
  const { translate } = useContext(LanguageContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          _id: (Date.now() + Math.random()).toString(),
          fees: 'Pending'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      const data = await response.json();
      message.success(translate('student_added_successfully'));
      form.resetFields();
      onAdd(data);
    } catch (error) {
      message.error(error.message || translate('failed_to_add_student'));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="add-student-container">
      <Form
        form={form}
        name="add-student-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label={translate('name')}
          rules={[
            {
              required: true,
              message: translate('please_enter_name')
            }
          ]}
        >
          <Input placeholder={translate('enter_name')} />
        </Form.Item>

        <Form.Item
          name="grade"
          label={translate('grade')}
          rules={[
            {
              required: true,
              message: translate('please_select_grade')
            }
          ]}
        >
          <Select placeholder={translate('select_grade')}>
            {[...Array(12)].map((_, index) => (
              <Option key={index + 1} value={(index + 1).toString()}>
                {translate('grade')} {index + 1}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="section"
          label={translate('section')}
          rules={[
            {
              required: true,
              message: translate('please_select_section')
            }
          ]}
        >
          <Select placeholder={translate('select_section')}>
            {[...'A', 'B', 'C', 'D', 'E'].map((section) => (
              <Option key={section} value={section}>
                {section}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="admissionNumber"
          label={translate('admission_number')}
          rules={[
            {
              required: true,
              message: translate('please_enter_admission_number')
            }
          ]}
        >
          <Input placeholder={translate('enter_admission_number')} />
        </Form.Item>

        <Form.Item
          name="gender"
          label={translate('gender')}
          rules={[
            {
              required: true,
              message: translate('please_select_gender')
            }
          ]}
        >
          <Select placeholder={translate('select_gender')}>
            <Option value="Male">{translate('male')}</Option>
            <Option value="Female">{translate('female')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="parent"
          label={translate('parent')}
          rules={[
            {
              required: true,
              message: translate('please_enter_parent_name')
            }
          ]}
        >
          <Input placeholder={translate('enter_parent_name')} />
        </Form.Item>

        <Form.Item
          name="contact"
          label={translate('contact')}
          rules={[
            {
              required: true,
              message: translate('please_enter_contact')
            }
          ]}
        >
          <Input placeholder={translate('enter_contact_number')} />
        </Form.Item>

        <Form.Item
          name="email"
          label={translate('email')}
          rules={[
            {
              type: 'email',
              message: translate('invalid_email')
            },
            {
              required: true,
              message: translate('please_enter_email')
            }
          ]}
        >
          <Input placeholder={translate('enter_email')} />
        </Form.Item>

        <Form.Item
          name="address"
          label={translate('address')}
          rules={[
            {
              required: true,
              message: translate('please_enter_address')
            }
          ]}
        >
          <Input.TextArea placeholder={translate('enter_address')} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('add_student')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddStudentForm;
