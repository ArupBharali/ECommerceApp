import { render, screen, waitFor } from '@testing-library/react';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import { getOrderDetails } from '../services/userService';

jest.mock('../services/userService');

test('loads and displays order details', async () => {
    const order = {
        id: 1,
        total: 100,
        date: '2024-01-01',
        items: [{ id: 1, productName: 'Product 1', price: 50, quantity: 2 }]
    };
    getOrderDetails.mockResolvedValue(order);

    render(<OrderDetailsPage orderId={1} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText('Order ID: 1')).toBeInTheDocument();
        expect(screen.getByText('Total: $100')).toBeInTheDocument();
        expect(screen.getByText('Date: 01/01/2024')).toBeInTheDocument();
        expect(screen.getByText('Product 1 - $50 x 2')).toBeInTheDocument();
    });
});
