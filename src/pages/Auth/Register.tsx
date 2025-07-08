import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 先请求验证码（模拟）
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/send-code`, { phone: values.phone });
      // 再注册
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/register`, {
        ...values,
        code: '123456', // 测试环境写死
      });
      message.success('注册成功，请登录');
      navigate('/auth/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    const values = form.getFieldsValue();
    console.log('当前表单值:', values);
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: 'center' }}>注册六度</Title>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}> <Input /> </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> <Input.Password /> </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}> <Input /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>注册</Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" block onClick={() => navigate('/auth/login')}>已有账号？去登录</Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={handleCheck}>获取当前表单值</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register; 