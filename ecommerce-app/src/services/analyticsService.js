// services/analyticsService.js
import axios from 'axios';

export const getSalesData = () => {
    return axios.get('/api/sales'); // Adjust endpoint as needed
};

export const getUserActivityData = () => {
    return axios.get('/api/user-activity'); // Adjust endpoint as needed
};
