import { render, screen, waitFor } from '@testing-library/react';
import OrdersPage from '../pages/OrdersPage';
import { getUserOrders } from '../services/userService';

jest.mock('../services/userService');

test('loads and displays user orders', async () => {
    const orders = [{ id: 1, total: 100, date: '2024-01-01' }];
    getUserOrders.mockResolvedValue(orders);

    render(<OrdersPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText('Order ID: 1')).toBeInTheDocument();
        expect(screen.getByText('Total: $100')).toBeInTheDocument();
        expect(screen.getByText('Date: 01/01/2024')).toBeInTheDocument();
    });
});
