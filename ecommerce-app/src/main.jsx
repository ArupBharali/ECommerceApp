console.log('Vite environment variables:', import.meta.env);
const isProd = import.meta.env.VITE_IS_PROD === 'true';
const API_URL = isProd ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL_AUTH_SERVICE;
console.log(isProd);
console.log(API_URL);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Custom styles (if any)

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);