import axios from 'axios';

//const API_URL = `${import.meta.env.VITE_API_URL}/product`;
const API_URL = 'http://localhost:5000/api/product'; // Ensure this is set correctly


export const getProducts = async (parameters) => {
    try {
        console.log('getProducts parameters', parameters);

        // Prepare query parameters
        const params = new URLSearchParams(parameters);

        // Make the request with the params object
        const response = await axios.get(`${API_URL}`, {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token here
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products", error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Pass the token here
            }
        });
        return response.data;  // Assuming the response data contains the product details
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;  // Throw error to handle it in the component
    }
};

export const addProduct = async (product) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            }
        });
        console.log('deleteProduct response',response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response;
        //return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, product) => {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your token if required
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};