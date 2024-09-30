import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Navbar from './components/Navbar/Navbar';  // Ensure Navbar is correctly imported
import ErrorBoundary from './pages/ErrorBoundary';
import { CartProvider } from './context/CartContext';
const ProductList = lazy(() => import('./pages/Product/ProductList'));
const ProductDetails = lazy(() => import('./pages/Product/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Login = lazy(() => import('./pages/Login/Login'));
const Logout = lazy(() => import('./pages/Login/Logout'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Register = lazy(() => import('./pages/Register/Register'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const OrdersPage = lazy(() => import('./pages/Order/OrdersPage'));
const SellPage = lazy(() => import('./pages/Seller/SellPage'));
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage'));
const UnauthorizedPage = lazy(() => import('./pages/Login/UnauthorizedPage'));
import ProtectedRoute from './pages/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { isAuthenticated } from './services/authService';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element, ...rest }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Layout className="layout">
                        <Navbar />
                        <Layout.Content style={{ padding: '0 50px', marginTop: 5 }}>
                            <ErrorBoundary>
                                <Suspense fallback={<div className="loading"><Spin size="large" /></div>}>
                                    <Routes>
                                        {/* Public routes */}
                                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                                        {/* Protected routes */}
                                        <Route path="/register" element={
                                            <ProtectedRoute roles={['Admin']} element={<Register />} />
                                        } />
                                        <Route path="/admin-dashboard" element={
                                            <ProtectedRoute roles={['Admin']} element={<AdminDashboard />} />
                                        } />
                                        <Route path="/sell" element={
                                            <ProtectedRoute roles={['Seller', 'Manager']} element={<SellPage />} />
                                        } />
                                        <Route path="/analyze" element={
                                            <ProtectedRoute roles={['Analyst', 'Manager']} element={<AnalyticsPage />} />
                                        } />

                                        <Route path="/login" element={<Login />} />
                                        <Route path="/logout" element={<Logout />} />
                                        <Route path="/products" element={<PrivateRoute element={<ProductList />} />} />
                                        <Route path="/products/:id" element={<PrivateRoute element={<ProductDetails />} />} />
                                        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
                                        <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
                                        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

                                        {/* Default route */}
                                        <Route path="/" element={<Navigate to="/products" />} />
                                    </Routes>
                                </Suspense>
                            </ErrorBoundary>
                        </Layout.Content>
                        <Layout.Footer style={{ textAlign: 'center' }}>
                            ©2024 Your Company Name
                        </Layout.Footer>
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

// Add prop-types validation
PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired, // Ensure element is a React element and required
};

export default App;

