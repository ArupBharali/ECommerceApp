import { useState, useMemo, useEffect } from 'react';
import { Radio, Input, Spin, Typography, Layout } from 'antd';
import ReactTable from '../../components/Grids/ReactTable/ReactTable';
import PaginationControl from '../../components/Pagination/PaginationControl';
import { getProducts } from '../../services/productService'; // Implement these services

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('products');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columnFilters, setColumnFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [error, setError] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [sort, setSort] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let result;
                switch (selectedTab) {
                    case 'products':
                        result = await getProducts({
                            ...columnFilters,
                            searchTerm,
                            minPrice,
                            maxPrice,
                            pageNumber,
                            pageSize,
                            sort
                        });
                        break;
                    //case 'orders':
                    //    result = await fetchOrders();
                    //    break;
                    //case 'users':
                    //    result = await fetchUsers();
                    //    break;
                    default:
                        result = [];
                }
                console.log('result grid', result);
                // Ensure result is an array
                if (Array.isArray(result.products)) {
                    setData(result.products);
                    setTotalRecords(result.totalRecords);
                } else {
                    setData([]);
                    setTotalRecords(0);
                }
            } catch (error) {
                console.error('Error loading data', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [columnFilters, searchTerm, selectedTab, pageNumber, pageSize, minPrice, maxPrice, sort]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    //const filteredData = useMemo(() => {
    //    if (!Array.isArray(data)) {
    //        return [];
    //    }
    //    return data.filter(item =>
    //    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //        item.id?.toString().includes(searchTerm))
    //    );
    //}, [data, searchTerm]);

    // Define columns based on your data structure
    const columns = useMemo(() => [
        {
            Header: 'Category',
            accessor: 'category',
            canFilter: true
        },
        {
            Header: 'Description',
            accessor: 'description',
            canFilter: true
        },
        {
            Header: 'Name',
            accessor: 'name',
            canFilter: true
        },
        {
            Header: 'Price',
            accessor: 'price',
            Cell: ({ value }) => `$${value.toFixed(2)}`, // Format price
            canFilter: true
        },
        {
            Header: 'Product ID',
            accessor: 'productId',
        },
        {
            Header: 'Stock',
            accessor: 'stock',
            canFilter: true
        }
    ], []);

    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <div style={{ padding: '30px' }}>
            <Title level={3}>Admin Dashboard</Title>
            <Radio.Group
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                style={{ marginBottom: '20px' }}
            >
                <Radio.Button value="products">Products</Radio.Button>
                <Radio.Button value="orders">Orders</Radio.Button>
                <Radio.Button value="users">Users</Radio.Button>
            </Radio.Group>

            {loading ? (
                <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spin size="large" />
                </Content>
            ) : (
                <div>
                    <Input.Search
                        placeholder="Search..."
                        onSearch={handleSearch}
                        style={{ marginBottom: '20px' }}
                    />

                    <ReactTable
                        columns={columns}
                        data={data}
                        pageIndex={pageNumber - 1}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        gotoPage={setPageNumber}
                        onPageSizeChange={setPageSize}
                        columnFilters={columnFilters}
                        setColumnFilters={setColumnFilters}
                    />

                    <PaginationControl
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        total={totalRecords}
                        onPageChange={setPageNumber}
                        onPageSizeChange={setPageSize}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
