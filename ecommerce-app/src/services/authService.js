import axios from 'axios';

//const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
const API_URL = 'http://localhost:5000/api/auth'; // Ensure this is set correctly


export const login = async (username, password) => {
    console.log('auth service login');
    try {
        console.log('API_URL', API_URL);

        const response = await axios.post(`${API_URL}/login`, { username, password });
        localStorage.setItem('token', response.data.token);
        return response.data.token;
    } catch (error) {
        console.error("Error logging in", error);
        throw error;
    }
};

export const getUserDetails = async () => {
    try {
        console.log('API_URL', API_URL);

        const response = await axios.get(`${API_URL}/userDetails`, {
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

export const register = async (email,password,confirmPassword) => {
    try {
        await axios.post(`${API_URL}/register`, { email, password, confirmPassword });
    } catch (error) {
        console.error("Error logging in", error);
        throw error;
    }
};

export const getAuthToken = () => {
    console.log('API_URL', API_URL);

    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            },
            body: ""
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('logout response', response); // Handle success message
        //localStorage.removeItem('token');

        const data = await response.json();
        return data;

        //// Get the token from local storage or wherever you're storing it
        //const token = localStorage.getItem('token');

        //const response = await axios.post(`${API_URL}/logout`, {
        //    headers: {
        //        'Authorization': `Bearer ${token}`, // Include the token if needed for authentication
        //        'Content-Type': 'application/json',
        //    },
        //});

        //return response.data.token;
    } catch (error) {
        console.error("Logout error", error.response.data);
        throw error;
    }
};
