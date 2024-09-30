const CART_KEY = 'cart';

export const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product, setCart) => {
    const cart = getCart();
    console.log('product to be added',product);
    const existingProduct = cart.find(item => item.productId === product.productId);

    if (existingProduct) {
        console.log('product exists, increasing count');
        existingProduct.quantity += 1;
    } else {
        console.log('product does not exist. adding to the cart');
        cart.push({ ...product, quantity: 1 });
    }
    console.log('cart updated',cart);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Also update the context
    setCart([...cart]);
};

export const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
};
