// pages/AnalyticsPage.js
import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, notification, Layout, Spin, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector } from 'recharts';
import { getSalesData, getUserActivityData } from '../../services/analyticsService'; // Mocked service functions
import './AnalyticsPage.css';

const { Content } = Layout;
const { Title } = Typography;

const AnalyticsPage = () => {
    const [salesData, setSalesData] = useState([]);
    const [userActivityData, setUserActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesResponse = await getSalesData();
                const activityResponse = await getUserActivityData();
                setSalesData(salesResponse.data);
                setUserActivityData(activityResponse.data);
            } catch (error) {
                notification.error({ message: 'Failed to fetch data', error });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sample data for demo purposes
    const salesChartData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 5000 },
        // Add more months as needed
    ];

    const userActivityChartData = [
        { name: 'Active Users', value: 400 },
        { name: 'Inactive Users', value: 100 },
    ];

    const salesTableColumns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Sales', dataIndex: 'sales', key: 'sales' },
    ];

    const salesTableData = [
        { key: '1', date: '2024-01-01', sales: 4000 },
        { key: '2', date: '2024-01-02', sales: 3000 },
        // Add more data as needed
    ];


    if (loading) return (
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </Content>
    );

    return (
        <div className="container" style={{ padding: '30px' }}>
            <div className="analytics-page">
                <Title level={3}>Analytics Dashboard</Title>

                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Total Sales">
                            <Statistic value={50000} prefix="$" />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="New Users">
                            <Statistic value={120} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Active Users">
                            <Statistic value={400} />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={12}>
                        <Card title="Monthly Sales">
                            <LineChart width={500} height={300} data={salesChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                            </LineChart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="User Activity">
                            <PieChart width={400} height={300}>
                                <Pie data={userActivityChartData} dataKey="value" outerRadius={80} label>
                                    <Sector
                                        cx={200}
                                        cy={150}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                    />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </Card>
                    </Col>
                </Row>

                <Card title="Sales Data Table" style={{ marginTop: '16px' }}>
                    <Table columns={salesTableColumns} dataSource={salesTableData} pagination={{ pageSize: 5 }} />
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
