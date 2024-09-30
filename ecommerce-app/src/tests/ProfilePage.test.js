import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/ProfilePage';
import { getUserDetails } from '../services/userService';

jest.mock('../services/userService');

test('loads and displays user details', async () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    getUserDetails.mockResolvedValue(user);

    render(<ProfilePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
        expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });
});
