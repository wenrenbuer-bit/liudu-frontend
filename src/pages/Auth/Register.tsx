import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await authAPI.register({
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

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: 'center' }}>注册六度</Title>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
          <Input autoComplete="tel" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input autoComplete="nickname" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>注册</Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" block onClick={() => navigate('/auth/login')}>已有账号？去登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register; 