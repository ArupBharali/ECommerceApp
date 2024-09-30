import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../services/userService';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderList = await getUserOrders();
                setOrders(orderList);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchOrders();
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!orders.length) return <LoadingIndicator />;

    return (
        <div>
            <h1>Order History</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <p>Order ID: {order.id}</p>
                        <p>Total: ${order.total}</p>
                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersPage;
