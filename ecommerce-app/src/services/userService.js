import axios from 'axios';

//const API_BASE_URL = `${import.meta.env.VITE_API_URL}/user`;  // Update the base URL if needed
const API_BASE_URL = 'http://localhost:5000/api/user'; // Ensure this is set correctly


const handleResponse = async (response) => {
    if (response.status !== 200) {
        // Axios errors are handled differently; you can check for status here
        throw new Error(response.data.message || 'Something went wrong');
    }
    return response.data; // Directly return the parsed JSON data
};

// Fetch logged-in user details
export const getUserDetails = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/details`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token here
            },
        });
        return handleResponse(response);

    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

// Fetch user order history
export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token here
            },
        });
        return handleResponse(response);

    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};
