import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnsafeComponent from './UnsafeComponent';

describe('UnsafeComponent', () => {
    it('renders the component correctly', () => {
        const { getByText } = render(
            <UnsafeComponent userInput="<script>alert('xss')</script>" />
        );
        expect(getByText('Unsafe Component')).toBeInTheDocument();
        expect(getByText('Dangerous Content:')).toBeInTheDocument();
        expect(getByText('Execute User Code')).toBeInTheDocument();
        expect(getByText('Fetch Data')).toBeInTheDocument();
        expect(getByText('Fetched Data:')).toBeInTheDocument();
    });

    it('executes user code on button click', () => {
        const mockEval = jest.fn();
        global.eval = mockEval;
        const { getByText } = render(
            <UnsafeComponent userInput="alert('test')" />
        );
        fireEvent.click(getByText('Execute User Code'));
        expect(mockEval).toHaveBeenCalledWith("alert('test')");
    });

    it('fetches data on button click', async () => {
        const mockJsonPromise = Promise.resolve({ data: 'mockData' });
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const { getByText, findByText } = render(
            <UnsafeComponent userInput="" />
        );
        fireEvent.click(getByText('Fetch Data'));

        expect(global.fetch).toHaveBeenCalledWith(
            'http://example.com/api/data'
        );
        expect(await findByText('mockData')).toBeInTheDocument();
    });
});
