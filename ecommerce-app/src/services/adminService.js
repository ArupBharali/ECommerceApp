// src/services/adminService.js
import axios from 'axios';

//const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set correctly
const API_URL = 'http://localhost:5000/api/admin'; // Ensure this is set correctly


export const fetchOrders = async () => {
    const response = await axios.get(`${API_URL}/orders`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
        }
    });
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
        }
    });
    return response.data;
};
