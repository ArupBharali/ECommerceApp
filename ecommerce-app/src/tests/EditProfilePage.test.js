import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProfilePage from '../pages/EditProfilePage';
import { updateUserDetails, getUserDetails } from '../services/userService';

jest.mock('../services/userService');

test('updates user profile', async () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    getUserDetails.mockResolvedValue(user);
    updateUserDetails.mockResolvedValue(user);

    render(<EditProfilePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByLabelText('Name:')).toHaveValue('John Doe');
        expect(screen.getByLabelText('Email:')).toHaveValue('john@example.com');
    });

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByText('Update Profile'));

    await waitFor(() => {
        expect(updateUserDetails).toHaveBeenCalledWith({ name: 'Jane Doe', email: 'jane@example.com' });
    });
});
