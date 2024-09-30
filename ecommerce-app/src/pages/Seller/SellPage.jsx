import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../../services/productService';
import { Form, Input, Button, Table, Modal, notification, Spin, Layout, Typography, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AntTable from '../../components/Grids/AntdTable/AntTable';

const { Content } = Layout;
const { Title } = Typography;

const SellPage = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [totalRecords, setTotalRecords] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Number of products per page
    const [sort, setSort] = useState('');

    const [data, setData] = useState([]);
    const [columnFilters, setColumnFilters] = useState({});

    useEffect(() => {
        fetchProducts();
        console.log('refreshing the products list', 'columnFilters', columnFilters);
    }, [pageNumber, pageSize, columnFilters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts({
                searchTerm,
                minPrice,
                maxPrice,
                pageNumber,
                pageSize,
                sort
            });
            console.log('fetchProducts response', response);
            setProducts(response.products);
            setTotalRecords(response.totalRecords);
        } catch (error) {
            notification.error({ message: 'Failed to fetch products' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateProduct = async (values) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.productId, values);
                notification.success({ message: 'Product updated successfully' });
            } else {
                await addProduct(values);
                notification.success({ message: 'Product added successfully' });
            }
            setEditingProduct(null);
            form.resetFields();
            setModalVisible(false);
            fetchProducts();
        } catch (error) {
            notification.error({ message: 'Failed to save product' });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        console.log('form while modifying', form.getFieldsValue());
        setModalVisible(true);
    };

    const handleDelete = async (productId) => {
        try {
            var response = await deleteProduct(productId);
            if (response.status === 204) { // Check for No Content status
                fetchProducts();
                notification.success({ message: 'Product deleted successfully' });
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            notification.error({ message: 'Failed to delete product' });
        }
    };

    useEffect(() => {
        console.log('Updated columnFilters from SellPage:', columnFilters);
    }, [columnFilters]);

    const handleCancel = () => {
        form.resetFields();
        setModalVisible(false);
        setEditingProduct(null);
    };

    // Render the Delete button with confirmation
    const renderDeleteButton = (record) => (
        <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.productId)} // Call handleDelete on confirmation
            okText="Yes"
            cancelText="No"
        >
            <Button icon={<DeleteOutlined />} danger>
                Delete
            </Button>
        </Popconfirm>
    );

    const columns = [
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    />
                    {renderDeleteButton(record)}
                </>
            )
        },
        { title: 'Name', dataIndex: 'name', key: 'name', sortable: true, searchable: true },
        { title: 'Category', dataIndex: 'category', key: 'category', sortable: true, searchable: true },
        { title: 'Price', dataIndex: 'price', key: 'price', sortable: true, searchable: true, render: price => `$${price.toFixed(2)}` },
        { title: 'Stock', dataIndex: 'stock', key: 'stock', sortable: true, searchable: true },
    ];

    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <div className="container" style={{ padding: '30px' }}>
            <div className="sell-page">
                <Title level={3}>Manage Your Products</Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setEditingProduct(null);
                        console.log('form before resetting', form.getFieldsValue());
                        form.resetFields();
                        console.log('form after resetting', form.getFieldsValue());
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: 16 }}
                >
                    Add Product
                </Button>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <AntTable
                        columns={columns}
                        data={products}
                        totalRecords={totalRecords}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        gotoPage={setPageNumber}
                        onPageSizeChange={setPageSize}
                        columnFilters={columnFilters}
                        setColumnFilters={setColumnFilters}
                        loading={loading}
                    />
                )}

                <Modal
                    title={editingProduct ? 'Edit Product' : 'Add Product'}
                    visible={modalVisible}
                    onCancel={() => {
                        // Custom behavior for cancel button
                        handleCancel();
                    }}
                    footer={[
                        <Button key="back" onClick={() => handleCancel()}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" form="productForm" htmlType="submit">
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    ]}
                    maskClosable={false} // Disable closing by clicking outside
                >
                    <Form
                        id="productForm"
                        form={form}
                        layout="vertical"
                        onFinish={handleAddOrUpdateProduct}
                        initialValues={editingProduct}
                    >
                        {/* Hide the productId field */}
                        <Form.Item name="productId" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please input the product name!' }]}>
                            <Input
                                placeholder="Enter product name"
                                disabled={editingProduct} // Disable if in edit mode
                            />

                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Product Description"
                            rules={[{ required: true, message: 'Please input product description!' }]}>
                            <Input
                                placeholder="Enter product description"
                                disabled={editingProduct} // Disable if in edit mode
                            />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select the category!' }]}>
                            <Input
                                placeholder="Enter product category"
                                disabled={editingProduct} // Disable if in edit mode
                            />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (value === undefined || value === '') {
                                            return Promise.reject(new Error('Please input the stock quantity!'));
                                        }
                                        if (value && !/^\d+(,\d{3})*(\.\d{1,2})?$/.test(value)) {
                                            return Promise.reject(new Error('Price must be a valid monetary amount!'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}>
                            <Input
                                type="text" // Use text type for formatting
                                step="0.01"
                                placeholder="Enter product price"
                                onChange={e => {
                                    // this is to not apply invalid changes at all
                                    const rawValue = e.target.value.replace(/,/g, ''); // Allow only digits
                                    console.log('e.target.value', e.target.value);
                                    console.log('rawValue', rawValue);
                                    //const numericValue = parseFloat(rawValue); // Convert to a number
                                    //console.log('numericValue', numericValue);

                                    // Format with thousand separators
                                    const formattedValue = isNaN(rawValue) ? '' : rawValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 10 });
                                    console.log('formattedValue stock', formattedValue);

                                    // Update the input field
                                    e.target.value = formattedValue;

                                    // Update the form state
                                    form.setFieldsValue({ price: formattedValue }); // Set raw value for validation

                                    // Trigger re-validation
                                    form.validateFields(['price'])
                                        .then(() => {
                                            console.log('Validation passed'); // Validation succeeded
                                        })
                                        .catch(errorInfo => {
                                            console.error('Validation failed:', errorInfo); // Validation failed
                                        });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="stock"
                            label="Stock"
                            rules={[
                                // this also works
                                //{
                                //    required: true,
                                //    message: 'Please input the stock quantity!'
                                //},
                                // but for more controlled validations, use this approach
                                {
                                    validator: (_, value) => {
                                        if (value === undefined || value === '') {
                                            return Promise.reject(new Error('Please input the stock quantity!'));
                                        }
                                        else {
                                            const rawValue = value.replace(/\D/g, '').replace(/,/g, ''); // Allow only digits
                                            const numericValue = parseFloat(rawValue); // Convert to a number

                                            if (numericValue < 0) {
                                                return Promise.reject(new Error('Stock must be a non-negative whole number!'));
                                            }
                                            if (!Number.isInteger(Number(numericValue))) {
                                                return Promise.reject(new Error('Stock must be a whole number!'));
                                            }
                                            return Promise.resolve();
                                        }
                                        
                                    },
                                },
                            ]}>
                            <Input
                                type="text"
                                step="1"
                                placeholder="Enter stock quantity"
                                onChange={e => {
                                    // this is to not apply invalid changes at all
                                    const rawValue = e.target.value.replace(/\D/g, '').replace(/,/g, ''); // Allow only digits
                                    const numericValue = parseFloat(rawValue); // Convert to a number

                                    // Format with thousand separators
                                    const formattedValue = isNaN(numericValue) ? '' : numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                                    console.log('formattedValue stock', formattedValue);

                                    // Update the input field
                                    e.target.value = formattedValue;

                                    // Update the form state
                                    form.setFieldsValue({ stock: formattedValue }); // Set raw value for validation

                                    // validation will be auto triggered, but if you forcefully want to apply
                                    form.validateFields(['stock'])
                                        .then(() => {
                                            console.log('Validation passed'); // Validation succeeded
                                        })
                                        .catch(errorInfo => {
                                            console.error('Validation failed:', errorInfo); // Validation failed
                                        });
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default SellPage;






//import React, { useState, useEffect } from 'react';
//import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/productService';
//import { Form, Input, Button, Table, Modal, notification, Spin } from 'antd';
//import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

//const SellPage = () => {
//    const [products, setProducts] = useState([]);
//    const [editingProduct, setEditingProduct] = useState(null);
//    const [modalVisible, setModalVisible] = useState(false);
//    const [loading, setLoading] = useState(false);
//    const [form] = Form.useForm();

//    useEffect(() => {
//        fetchProducts();
//    }, []);

//    const fetchProducts = async () => {
//        setLoading(true);
//        try {
//            const response = await getProducts();
//            setProducts(response.data);
//        } catch (error) {
//            notification.error({ message: 'Failed to fetch products' });
//        } finally {
//            setLoading(false);
//        }
//    };

//    const handleAddOrUpdateProduct = async (values) => {
//        try {
//            if (editingProduct) {
//                await updateProduct(editingProduct.id, values);
//                notification.success({ message: 'Product updated successfully' });
//            } else {
//                await addProduct(values);
//                notification.success({ message: 'Product added successfully' });
//            }
//            setEditingProduct(null);
//            form.resetFields();
//            setModalVisible(false);
//            fetchProducts();
//        } catch (error) {
//            notification.error({ message: 'Failed to save product' });
//        }
//    };

//    const handleEdit = (product) => {
//        setEditingProduct(product);
//        form.setFieldsValue(product);
//        setModalVisible(true);
//    };

//    const handleDelete = async (id) => {
//        try {
//            await deleteProduct(id);
//            fetchProducts();
//            notification.success({ message: 'Product deleted successfully' });
//        } catch (error) {
//            notification.error({ message: 'Failed to delete product' });
//        }
//    };

//    const columns = [
//        { title: 'Name', dataIndex: 'name', key: 'name' },
//        { title: 'Category', dataIndex: 'category', key: 'category' },
//        { title: 'Price', dataIndex: 'price', key: 'price', render: price => `$${price.toFixed(2)}` },
//        { title: 'Stock', dataIndex: 'stock', key: 'stock' },
//        {
//            title: 'Actions',
//            key: 'actions',
//            render: (_, record) => (
//                <>
//                    <Button
//                        icon={<EditOutlined />}
//                        onClick={() => handleEdit(record)}
//                        style={{ marginRight: 8 }}
//                    />
//                    <Button
//                        icon={<DeleteOutlined />}
//                        onClick={() => handleDelete(record.id)}
//                        danger
//                    />
//                </>
//            )
//        }
//    ];

//    return (
//        <div className="sell-page">
//            <h2>Manage Your Products</h2>
//            <Button
//                type="primary"
//                onClick={() => {
//                    setEditingProduct(null);
//                    form.resetFields();
//                    setModalVisible(true);
//                }}
//                style={{ marginBottom: 16 }}
//            >
//                Add Product
//            </Button>

//            {loading ? (
//                <Spin size="large" />
//            ) : (
//                <Table
//                    dataSource={products}
//                    columns={columns}
//                    rowKey="id"
//                    pagination={{ pageSize: 10 }}
//                />
//            )}

//            <Modal
//                title={editingProduct ? 'Edit Product' : 'Add Product'}
//                visible={modalVisible}
//                onCancel={() => setModalVisible(false)}
//                footer={null}
//            >
//                <Form
//                    form={form}
//                    layout="vertical"
//                    onFinish={handleAddOrUpdateProduct}
//                    initialValues={editingProduct}
//                >
//                    <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
//                        <Input placeholder="Enter product name" />
//                    </Form.Item>
//                    <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select the category!' }]}>
//                        <Input placeholder="Enter product category" />
//                    </Form.Item>
//                    <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
//                        <Input type="number" step="0.01" placeholder="Enter product price" />
//                    </Form.Item>
//                    <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock quantity!' }]}>
//                        <Input type="number" placeholder="Enter stock quantity" />
//                    </Form.Item>
//                    <Form.Item>
//                        <Button type="primary" htmlType="submit">
//                            {editingProduct ? 'Update Product' : 'Add Product'}
//                        </Button>
//                    </Form.Item>
//                </Form>
//            </Modal>
//        </div>
//    );
//};

//export default SellPage;




//// pages/SellPage.js
//import React, { useState, useEffect } from 'react';
//import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/productService';
//import { Form, Input, Button, Table, Modal, notification } from 'antd';
//import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

//const SellPage = () => {
//    const [products, setProducts] = useState([]);
//    const [editingProduct, setEditingProduct] = useState(null);
//    const [form] = Form.useForm();

//    useEffect(() => {
//        fetchProducts();
//    }, []);

//    const fetchProducts = async () => {
//        try {
//            const response = await getProducts();
//            setProducts(response.data);
//        } catch (error) {
//            notification.error({ message: 'Failed to fetch products' });
//        }
//    };

//    const handleAddOrUpdateProduct = async (values) => {
//        try {
//            if (editingProduct) {
//                await updateProduct(editingProduct.id, values);
//            } else {
//                await addProduct(values);
//            }
//            setEditingProduct(null);
//            form.resetFields();
//            fetchProducts();
//            notification.success({ message: 'Product saved successfully' });
//        } catch (error) {
//            notification.error({ message: 'Failed to save product' });
//        }
//    };

//    const handleEdit = (product) => {
//        setEditingProduct(product);
//        form.setFieldsValue(product);
//    };

//    const handleDelete = async (id) => {
//        try {
//            await deleteProduct(id);
//            fetchProducts();
//            notification.success({ message: 'Product deleted successfully' });
//        } catch (error) {
//            notification.error({ message: 'Failed to delete product' });
//        }
//    };

//    const columns = [
//        { title: 'Name', dataIndex: 'name', key: 'name' },
//        { title: 'Category', dataIndex: 'category', key: 'category' },
//        { title: 'Price', dataIndex: 'price', key: 'price', render: price => `$${price.toFixed(2)}` },
//        { title: 'Stock', dataIndex: 'stock', key: 'stock' },
//        {
//            title: 'Actions',
//            key: 'actions',
//            render: (_, record) => (
//                <>
//                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
//                </>
//            )
//        }
//    ];

//    return (
//        <div className="sell-page">
//            <h2>Manage Your Products</h2>
//            <Form
//                form={form}
//                layout="vertical"
//                onFinish={handleAddOrUpdateProduct}
//                initialValues={editingProduct}
//            >
//                <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
//                    <Input placeholder="Enter product name" />
//                </Form.Item>
//                <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select the category!' }]}>
//                    <Input placeholder="Enter product category" />
//                </Form.Item>
//                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
//                    <Input type="number" step="0.01" placeholder="Enter product price" />
//                </Form.Item>
//                <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock quantity!' }]}>
//                    <Input type="number" placeholder="Enter stock quantity" />
//                </Form.Item>
//                <Form.Item>
//                    <Button type="primary" htmlType="submit">
//                        {editingProduct ? 'Update Product' : 'Add Product'}
//                    </Button>
//                </Form.Item>
//            </Form>

//            <Table
//                dataSource={products}
//                columns={columns}
//                rowKey="id"
//                pagination={{ pageSize: 10 }}
//            />
//        </div>
//    );
//};

//export default SellPage;
