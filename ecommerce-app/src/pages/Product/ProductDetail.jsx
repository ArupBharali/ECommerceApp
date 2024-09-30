import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { addToCart } from '../../services/cartService';
import { Layout, Card, Button, Typography, Spin, Alert, Row, Col } from 'antd';
import CartContext from '../../context/CartContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { setCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false); // State for image error
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                console.log('product details',data);
                setProduct(data);
            } catch (err) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, setCart);
        navigate('/cart');
    };

    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <Content style={{ padding: '50px', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Row justify="center" style={{ width: '100%' }}>
                <Col xs={24} sm={22} md={18} lg={16} xl={14}>
                    <Card
                        style={{ display: 'flex', flexDirection: 'row', borderRadius: 8 }}
                        bodyStyle={{ display: 'flex', flexDirection: 'row', padding: 20 }}
                    >
                        <Col span={8} style={{ paddingRight: 20 }}>
                            <img loading="lazy"
                                src={imageError ? 'https://via.placeholder.com/300' : product?.imageUrl}
                                alt={product?.name || 'Product Image'}
                                style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                                onError={() => setImageError(true)} // Handle image load error
                            />
                        </Col>
                        <Col span={16}>
                            <Title level={2}>{product?.name || 'Product Name'}</Title>
                            <Text strong>Price:</Text> <Text>${product?.price || 'N/A'}</Text><br />
                            <Text strong>Category:</Text> <Text>{product?.category || 'N/A'}</Text><br />
                            <Text strong>Stock:</Text> <Text>{product?.stock || 'N/A'}</Text><br />
                            <Text strong>Description:</Text><br />
                            <Text>{product?.description || 'No description available.'}</Text><br />
                            {product && (
                                <Button type="primary" onClick={handleAddToCart} style={{ marginTop: 20 }}>
                                    Add to Cart
                                </Button>
                            )}
                        </Col>
                    </Card>
                    {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 20 }} />}
                </Col>
            </Row>
        </Content>
    );
};

export default ProductDetail;
