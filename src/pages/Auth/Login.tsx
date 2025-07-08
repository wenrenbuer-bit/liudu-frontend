import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/login`, values);
      localStorage.setItem('token', res.data.token);
      message.success('登录成功');
      navigate('/home');
    } catch (err: any) {
      message.error(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: 'center' }}>登录六度</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}> <Input /> </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> <Input.Password /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" block onClick={() => navigate('/auth/register')}>没有账号？去注册</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login; 