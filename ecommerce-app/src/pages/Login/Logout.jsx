import { logout } from '../../services/authService';

// src/pages/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();

        localStorage.removeItem('userDetails'); // Clear user details if stored

        // Perform any other cleanup needed here (e.g., API call to invalidate token)

        // Redirect to login or homepage after logging out
        navigate('/login');
    }, [navigate]);

    return null; // Optional: You can display a message like "Logging out..."
};

export default Logout;
