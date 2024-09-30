import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const updateCart = (updatedCart) => {
        updatedCart = updatedCart ? updatedCart : [];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    const increaseQuantity = (productId) => {
        console.log(productId);
        const updatedCart = cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        updateCart(updatedCart);
    };

    const decreaseQuantity = (productId) => {
        const updatedCart = cart.map(item =>
            item.productId === productId && item.quantity > 0
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ).filter(item => item.quantity > 0);
        updateCart(updatedCart);
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        updateCart(updatedCart);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, updateCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

// Add prop-types validation
CartProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensure children is a React node and is required
};

export default CartContext;
