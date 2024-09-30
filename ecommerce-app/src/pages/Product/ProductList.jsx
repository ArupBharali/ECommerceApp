import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Input, Card, Row, Col, Pagination, Select, Form, InputNumber, Spin, Alert, Typography } from 'antd';
import { getProducts } from '../../services/productService';
import ProductFilter from './ProductFilter';

const { Content } = Layout;
const { Title } = Typography;

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10); // Number of products per page
    const [sort, setSort] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts({
                    searchTerm,
                    minPrice,
                    maxPrice,
                    pageNumber,
                    pageSize,
                    sort
                });
                setProducts(data.products);
                setTotalRecords(data.totalRecords);
            }
            catch (err) {
                if (err.response?.status === 401) {
                    navigate('/unauthorized');
                }
                else {
                    setError('Failed to fetch product details.');
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchTerm, minPrice, maxPrice, pageNumber, pageSize, sort, navigate]);

    const onSearch = value => setSearchTerm(value);

    const handlePageChange = (page) => {
        setPageNumber(page);
    };

    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    if (error) return <Alert message={`Error: ${error}`} type="error" showIcon />;

    return (
        <div className="container" style={{ padding: '30px' }}>
            <Title level={3}>Product Catalogues</Title>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <Search
                        placeholder="Search for products..."
                        onSearch={onSearch}
                        enterButton
                        allowClear
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Form layout="inline">
                        <Form.Item label="Min Price">
                            <InputNumber
                                min={0}
                                value={minPrice}
                                onChange={value => setMinPrice(value)}
                            />
                        </Form.Item>
                        <Form.Item label="Max Price">
                            <InputNumber
                                min={0}
                                value={maxPrice}
                                onChange={value => setMaxPrice(value)}
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8}>
                    <Select
                        placeholder="Sort By"
                        value={sort}
                        onChange={(value) => setSort(value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="">Default</Option>
                        <Option value="price_asc">Price: Low to High</Option>
                        <Option value="price_desc">Price: High to Low</Option>
                        <Option value="name_asc">Name: A-Z</Option>
                        <Option value="name_desc">Name: Z-A</Option>
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {products.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                        <Card
                            hoverable
                            title={product.name}
                            extra={<Link to={`/products/${product.productId}`}>View Details</Link>}
                        >
                            <p>{product.description}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row justify="center" style={{ marginTop: '20px' }}>
                <Pagination
                    current={pageNumber}
                    pageSize={pageSize}
                    total={totalRecords}
                    onChange={handlePageChange}
                />
            </Row>
        </div>
    );
};

export default ProductList;
