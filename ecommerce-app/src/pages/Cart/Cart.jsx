import { useContext } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Row, Col, Card, List, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import CartContext from '../../context/CartContext';

const { Title, Text } = Typography;

const Cart = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

    return (
        <Content style={{ padding: '50px', minHeight: '100vh' }}>
            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Card
                        title={<Title level={3}>Your Shopping Cart</Title>}
                        bordered={false}
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {cart.length === 0 ? (
                            <Text>Your cart is empty.</Text>
                        ) : (
                            <>
                                <div
                                    style={{
                                        height: '400px', // Fixed height for scrolling
                                        overflowY: 'auto',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #f0f0f0',
                                    }}
                                >
                                    <List
                                        dataSource={cart}
                                        renderItem={(item) => (
                                            <List.Item
                                                key={item.id}
                                                style={{ padding: '12px 0' }} // Space between items
                                            >
                                                <Row gutter={16} justify="space-between" align="middle">
                                                    {/* Item Name and Price */}
                                                    <Col flex="auto">
                                                        <Title level={5} style={{ marginBottom: 0 }}>
                                                            {item.name}
                                                        </Title>
                                                        <Text>Price:  ${item ? item.price.toFixed(2) : 0}</Text>
                                                    </Col>

                                                    {/* Quantity Controls */}
                                                    <Col>
                                                        <Button
                                                            type="default"
                                                            onClick={() => decreaseQuantity(item.productId)}
                                                            style={{ marginRight: '8px' }}
                                                        >
                                                            -
                                                        </Button>
                                                        <span style={{ marginRight: '8px' }}>{item.quantity}</span>
                                                        <Button
                                                            type="default"
                                                            onClick={() => increaseQuantity(item.productId)}
                                                        >
                                                            +
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                </div>

                                {/* Checkout Button */}
                                <div style={{ textAlign: 'right', marginTop: 20 }}>
                                    <Link to="/checkout">
                                        <Button type="primary" size="large">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default Cart;
