import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import UnsafeComponent from './UnsafeComponent';

describe('UnsafeComponent', () => {
    it('renders without crashing', () => {
        render(<UnsafeComponent userInput="<script>alert('test')</script>" />);
        expect(screen.getByText('Unsafe Component')).toBeInTheDocument();
    });

    it('displays user input dangerously', () => {
        const { container } = render(
            <UnsafeComponent userInput="<b>Bold Text</b>" />
        );
        expect(container.querySelector('span')?.innerHTML).toBe(
            '<b>Bold Text</b>'
        );
    });

    it('calls executeCode on button click', () => {
        const executeCodeMock = jest.fn();
        // Replace eval function with a mock
        global.eval = executeCodeMock;

        render(<UnsafeComponent userInput="console.log('Executing')" />);
        fireEvent.click(screen.getByText('Execute User Code'));
        expect(executeCodeMock).toHaveBeenCalledWith(
            "console.log('Executing')"
        );

        // Restore the original eval function
        delete global.eval;
    });

    it('fetchData button calls fetch with correct URL', async () => {
        // Mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: 'fetched data' }),
            })
        );

        render(<UnsafeComponent userInput="" />);
        fireEvent.click(screen.getByText('Fetch Data'));

        expect(global.fetch).toHaveBeenCalledWith(
            'http://example.com/api/data'
        );

        // Restore original fetch
        delete global.fetch;
    });

    it('renders fetched data correctly', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve('fetched data'),
            })
        );

        const { findByText } = render(<UnsafeComponent userInput="" />);
        fireEvent.click(screen.getByText('Fetch Data'));

        const fetchedDataElement = await findByText('fetched data');
        expect(fetchedDataElement).toBeInTheDocument();

        delete global.fetch;
    });
});
