import { useState, useEffect } from 'react';
import { getOrderDetails } from '../../services/userService';
import PropTypes from 'prop-types';

const OrderDetailsPage = ({ orderId }) => {
    const [order, setOrder] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderDetails = await getOrderDetails(orderId);
                setOrder(orderDetails);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Order Details</h1>
            <p>Order ID: {order.id}</p>
            <p>Total: ${order.total}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <h2>Items</h2>
            <ul>
                {order.items.map(item => (
                    <li key={item.id}>
                        {item.productName} - ${item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetailsPage;
