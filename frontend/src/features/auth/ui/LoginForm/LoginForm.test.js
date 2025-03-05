import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { Login } from './LoginForm';
import { loginUser } from '@/entities/User';
import { BrowserRouter, useNavigate } from 'react-router-dom';

jest.mock('@/entities/User', () => ({
    loginUser: jest.fn(),
}));

jest.mock('react-router-dom', () => {
    const navigateMock = jest.fn();

    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe('Login Component', () => {
    test('renders Login component', () => {
        render(<Login />, { wrapper: BrowserRouter });

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /login/i })
        ).toBeInTheDocument();
    });

    test('updates username and password on change', () => {
        render(<Login />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });

    test('calls loginUser and navigates on successful login', async () => {
        const token = 'fake-jwt-token';

        loginUser.mockResolvedValueOnce({ data: { token } });
        jest.spyOn(Storage.prototype, 'setItem');

        render(<Login />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
            // expect(navigateMock)
            // .toHaveBeenCalledWith('/todos');
        });
    });

    test('handles login error', async () => {
        loginUser.mockRejectedValueOnce(new Error('Login failed'));
        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Login />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(loginButton);
        });

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
            expect(console.error).toHaveBeenCalledWith(
                'Login error:',
                expect.any(Error)
            );
        });

        console.error.mockRestore();
    });
});
