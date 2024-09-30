import React, { useState, useEffect } from 'react';
import { getUserDetails, getUserOrders } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { Card, List, Typography, Spin, Alert, Button, Layout } from 'antd';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user details and order history
        const fetchProfileData = async () => {
            try {
                const userDetails = await getUserDetails();
                setUser(userDetails);
                const userOrders = await getUserOrders();
                setOrders(userOrders);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleOrderClick = (orderId) => {
        navigate(`/order/${orderId}`);  // Navigate to order details page
    };

    if (error) return <Alert message={`Error: ${error}`} type="error" showIcon />;
    if (!user) return <LoadingIndicator />;
    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <div style={{ padding: '20px' }}>
            <Card title={<Title level={2}>{user.name}&apos;s Profile</Title>} style={{ marginBottom: '20px' }}>
                <Text>Email: {user.email}</Text>
            </Card>

            <Card title={<Title level={3}>Order History</Title>} style={{ maxWidth: '600px', margin: 'auto' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={orders}
                    renderItem={order => (
                        <List.Item
                            actions={[<Button type="link" onClick={() => handleOrderClick(order.id)}>View Details</Button>]}
                        >
                            <List.Item.Meta
                                title={`Order #${order.id}`}
                                description={
                                    <>
                                        <Text strong>Total: ${order.total.toFixed(2)}</Text>
                                        <br />
                                        <Text type="secondary">Date: {new Date(order.date).toLocaleDateString()}</Text>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Profile;
