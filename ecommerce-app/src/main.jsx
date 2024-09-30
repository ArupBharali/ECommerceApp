console.log('Vite environment variables:', import.meta.env);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Custom styles (if any)

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);