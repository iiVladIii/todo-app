import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthPage } from './AuthPage';
import { Login, Register } from '@/features/auth';

// Mock the imported components
jest.mock('@/features/auth', () => ({
    Login: jest.fn(() => (
        <div data-testid="login-component">Login Component</div>
    )),
    Register: jest.fn(() => (
        <div data-testid="register-component">Register Component</div>
    )),
}));

describe('AuthPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with Login tab active by default', () => {
        render(<AuthPage />);

        // Check if the tabs are rendered
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();

        // Check if the Login component is rendered by default
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
        expect(
            screen.queryByTestId('register-component')
        ).not.toBeInTheDocument();
    });

    it('switches to Register tab when clicked', () => {
        render(<AuthPage />);

        // Click on the Register tab
        fireEvent.click(screen.getByText('Register'));

        // Check if the Register component is rendered after the click
        expect(screen.queryByTestId('login-component')).not.toBeInTheDocument();
        expect(screen.getByTestId('register-component')).toBeInTheDocument();
    });

    it('switches back to Login tab when clicked', () => {
        render(<AuthPage />);

        // First switch to Register tab
        fireEvent.click(screen.getByText('Register'));

        // Then switch back to Login tab
        fireEvent.click(screen.getByText('Login'));

        // Check if the Login component is rendered again
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
        expect(
            screen.queryByTestId('register-component')
        ).not.toBeInTheDocument();
    });

    it('applies className prop correctly', () => {
        const testClassName = 'test-class';
        const { container } = render(<AuthPage className={testClassName} />);

        // Find the outermost Box element
        const boxElement = container.firstChild;

        // Check if it has the className attribute with our test class
        //@ts-ignore
        expect(boxElement?.className).toContain(testClassName);
    });

    it('renders with correct styling', () => {
        const { container } = render(<AuthPage />);

        // Since we can't directly test the sx prop, we'll test if the component renders
        // without errors and check if the basic structure is maintained
        expect(container.firstChild).toBeInTheDocument();

        // Check if tabs are rendered
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();

        // Check if content is rendered
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
});
