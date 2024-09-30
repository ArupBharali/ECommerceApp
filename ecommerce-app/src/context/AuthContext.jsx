// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { getUserDetails } from '../services/userService'; // Assuming you have this service
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Track the authenticated user
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        async function fetchUserDetails() {
            const response = await getUserDetails();
            setUser(response.user.userName);
            setRoles(response.roles); // Assuming the roles are returned in the response
        }
        fetchUserDetails();
    }, []);

    const login = (userData) => {
        console.log('auth context login');
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        setUser(userData); // Update the user state
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null); // Reset the user state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, roles }}>
            {children}
        </AuthContext.Provider>
    );
};

// Add prop-types validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensure children is a React node and is required
};

export default AuthContext;
