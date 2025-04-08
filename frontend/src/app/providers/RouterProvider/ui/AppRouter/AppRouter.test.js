import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';

// Mock the modules
jest.mock('@/pages/AuthPage', () => ({
    AuthPage: () => <div data-testid="auth-page">Auth Page</div>,
}));

jest.mock('@/pages/TodoPage', () => ({
    TodoPage: () => <div data-testid="todo-page">Todo Page</div>,
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('AppRouter', () => {
    beforeEach(() => {
        // Clear localStorage and mocks before each test
        localStorage.clear();
        mockedNavigate.mockClear();
    });

    test('renders AuthPage when not authenticated', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/auth']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    test('redirects to /auth when not authenticated and accessing other routes', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/random-route']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    test('renders TodoPage when authenticated and accessing /todos', async () => {
        // Set token in localStorage
        localStorage.setItem('token', 'test-token');

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/todos']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        expect(screen.getByTestId('todo-page')).toBeInTheDocument();
    });

    test('navigates to /todos when token exists', async () => {
        // Set token in localStorage
        localStorage.setItem('token', 'test-token');

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/auth']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/todos');
        });
    });

    test('does not navigate when token does not exist', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/auth']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('does not render routes that require authentication when not authenticated', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/todos']}>
                    <AppRouter />
                </MemoryRouter>
            );
        });

        expect(screen.queryByTestId('todo-page')).not.toBeInTheDocument();
        expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });
});
