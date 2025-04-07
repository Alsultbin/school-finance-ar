import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await register(values);
      message.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>
        
        <Form
          name="signup"
          onFinish={onFinish}
          className="auth-form"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input
              prefix={<PhoneOutlined />}
              type="tel"
              placeholder="Phone Number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form.Item>
      </Form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  </div>
);
