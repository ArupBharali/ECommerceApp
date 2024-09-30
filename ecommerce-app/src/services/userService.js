import axios from 'axios';

const isProd = import.meta.env.VITE_IS_PROD === 'true';
const API_URL = isProd ? `${import.meta.env.VITE_PROD_API_URL}/users` : `${import.meta.env.VITE_DEV_API_URL_USER_SERVICE}/users`;

const handleResponse = async (response) => {
    console.log('log the response',response);
    if (response.status !== 200 && response.status !== 204) {
        // Axios errors are handled differently; you can check for status here
        throw new Error(response.data.message || 'Something went wrong');
    }
    return response.data; // Directly return the parsed JSON data
};

export const getUserDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/details`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const fetchUsers = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/search?query=${query}`, {
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

export const fetchUserRoles = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/roles`, {
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

export const assignUserRoles = async (userId, roleNames) => {
    try {
        const response = await fetch(`${API_URL}/${userId}/roles/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            },
            body: JSON.stringify({ roles: roleNames })
        });
        
        if (!response.ok) {
            console.error(response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return handleResponse(response);
    } catch (error) {
        console.error('Error assigning roles:', error);
        throw error;
    }
};

export const removeUserRoles = async (userId, roleNames) => {
    try {
        const response = await fetch(`${API_URL}/${userId}/roles/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            },
            body: JSON.stringify({ roles: roleNames })
        });
        
        if (!response.ok) {
            console.error(response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return handleResponse(response);
    } catch (error) {
        console.error('Error removing roles:', error);
        throw error;
    }
};

// Fetch user order history
export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/orders`, {
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
