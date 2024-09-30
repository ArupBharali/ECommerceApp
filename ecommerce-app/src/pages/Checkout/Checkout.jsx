import { useState, useEffect, useContext } from 'react';
import { getCart, clearCart } from '../../services/cartService';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';

const Checkout = () => {
    const [localCart, setLocalCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();
    const { updateCart } = useContext(CartContext);

    useEffect(() => {
        const cartItems = getCart();
        setLocalCart(cartItems);
        setTotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, []);

    const handlePayment = () => {
        // Simulate payment success
        setPaymentSuccess(true);
        clearCart();
        setLocalCart([]);
        updateCart(null);

        setTimeout(() => {
            navigate('/products'); // Redirect to products page after payment
        }, 2000);
    };

    if (paymentSuccess) {
        return <div>Payment successful! Redirecting to products...</div>;
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <ul>
                {localCart.map(item => (
                    <li key={item.id}>
                        <h4>{item.name}</h4>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={handlePayment}>Complete Payment</button>
        </div>
    );
};

export default Checkout;
