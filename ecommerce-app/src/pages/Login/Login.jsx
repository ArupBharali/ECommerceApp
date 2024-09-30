import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd'; // Ant Design components
import { login as loginService } from '../../services/authService';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (values) => {
        const { username, password } = values;
        try {
            await loginService(username, password);
            login(username); // After successful login, update AuthContext
            navigate('/products'); // Redirect to products page on successful login
        } catch (err) {
            setError('Invalid username or password', err);
        }
    };

    return (
        <div className="login-container">
            <Form
                name="login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                style={{ width: '100%', maxWidth: 400 }}
            >
                <h2>Login</h2>
                {error && <Alert message={error} type="error" showIcon />}
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
