import axios from 'axios';

const isProd = import.meta.env.VITE_IS_PROD === 'true';
const API_BASE_URL = isProd ? `${import.meta.env.VITE_PROD_API_URL}/roles` : `${import.meta.env.VITE_DEV_API_URL_ROLE_SERVICE}/roles`;

const handleResponse = async (response) => {
    if (response.status !== 200) {
        // Axios errors are handled differently; you can check for status here
        throw new Error(response.data.message || 'Something went wrong');
    }
    return response.data; // Directly return the parsed JSON data
};

export const fetchRoles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token here
            },
        });
        return handleResponse(response);

    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

