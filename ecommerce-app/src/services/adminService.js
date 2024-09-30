// src/services/adminService.js
import axios from 'axios';

const isProd = import.meta.env.VITE_IS_PROD === 'true';
const API_URL = isProd ? `${import.meta.env.VITE_PROD_API_URL}/admin` : `${import.meta.env.VITE_DEV_API_URL_ADMIN_SERVICE}/admin`;

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
