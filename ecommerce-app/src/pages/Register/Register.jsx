// src/pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Layout, Spin } from 'antd';
import { register } from '../../services/authService';

const { Content } = Layout;

const Register = () => {
    console.log('Register component rendered'); // Check if this log appears in the console

    const [form] = Form.useForm();
    const [errors, setErrors] = useState([]); // Array to hold multiple errors
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);

        const { email, password, confirmPassword } = values;
        const errorList = [];

        // Client-side validations
        if (password !== confirmPassword) {
            errorList.push('Passwords do not match.');
        }

        // Other client-side validations (e.g., password must contain specific characters)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordPattern.test(password)) {
            errorList.push('Password must contain at least one lowercase and one uppercase letter.');
        }

        // If there are client-side errors, display them
        if (errorList.length > 0) {
            setErrors(errorList);
            return;
        }

        try {
            await register(email, password, confirmPassword);
            navigate('/login'); // Redirect to login page on successful registration
        } catch (err) {
            // Handle errors from API (backend validation errors)
            console.log('Debug:', err.response?.data);
            setErrors(err.response?.data || ['An error occurred. Please try again.']);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <div className="container" style={{ padding: '30px' }}>
            <Layout style={{ minHeight: '100vh' }}>
                <Content style={{ padding: '0 50px', width: '100%' }}>
                    <div className="site-layout-content" style={{ maxWidth: 600, margin: 'auto' }}>
                        <h2>New User Registration</h2>
                        <Form
                            form={form}
                            name="register"
                            onFinish={handleSubmit}
                            layout="vertical"
                            style={{ width: '100%' }}
                        >
                            {/* Display error messages */}
                            {errors.length > 0 && (
                                <Alert
                                    message="Error"
                                    description={errors.map((error, index) => <div key={index}>{error}</div>)}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />
                            )}
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email address!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                rules={[{ required: true, message: 'Please confirm your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default Register;
