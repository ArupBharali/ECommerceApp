import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Ensure this path is correct
import CartContext from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { roles } = useContext(AuthContext);

    const handleLogout = () => {
        logout(); // This will clear the user context and localStorage
        navigate('/login');
    };

    const totalCartItems = cart.map(item => item.quantity).reduce((acc, quantity) => acc + quantity, 0);

    return (
        <nav>
            <ul className="left-items">
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/profile">Profile</Link></li> {/* Profile link */}
                {roles.includes('Admin') && <li><Link to="/register">Registration</Link></li>}
                {roles.includes('Admin') && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
                {(roles.includes('Seller') || roles.includes('Manager')) && <li><Link to="/sell">Sell</Link></li>}
                {(roles.includes('Analyst') || roles.includes('Manager')) && <li><Link to="/analyze">Analyze</Link></li>}
            </ul>

            <ul className="right-items">
                {user ? (
                    <>
                        <li><Link to="/cart">Cart ({totalCartItems})</Link></li>
                        <li className="text-white">Welcome, {user}</li>
                        <li><Link to="/logout" onClick={handleLogout}>Logout</Link></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
