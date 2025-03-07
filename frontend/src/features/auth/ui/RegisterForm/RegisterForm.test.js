import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import '@testing-library/jest-dom';
import { Register } from './RegisterForm';
import { loginUser, registerUser } from '@/entities/User';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@/entities/User', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Register component', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /register/i })
        ).toBeInTheDocument();
    });

    test('handles successful registration and login', async () => {
        const mockToken = 'mockToken';
        registerUser.mockResolvedValue({ data: {} });
        loginUser.mockResolvedValue({ data: { token: mockToken } });

        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password1dsafdf' },
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /register/i }));
        });

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith(
                'testuser',
                'password1dsafdf'
            );
            expect(loginUser).toHaveBeenCalledWith(
                'testuser',
                'password1dsafdf'
            );
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'token',
                mockToken
            );
        });
    });

    test('handles registration error', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        registerUser.mockRejectedValue(new Error('Registration error'));

        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password' },
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /register/i }));
        });

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith('testuser', 'password');
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Registration error:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });
});

beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
        value: {
            setItem: jest.fn(),
        },
        writable: true,
    });
});
