import React from 'react';
import {
    render,
    screen,
    waitFor,
    fireEvent,
    act,
} from '@testing-library/react';
import { TodoPage } from './TodoPage';
import { fetchLists, createList, deleteList } from '@/entities/TodoList';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock the modules
jest.mock('@/entities/TodoList', () => ({
    fetchLists: jest.fn(),
    createList: jest.fn(),
    deleteList: jest.fn(),
    TodoList: jest.fn().mockImplementation(({ list }) => (
        <div data-testid={`todo-list-${list.id}`}>
            {list.title}
            <button data-testid={`delete-list-${list.id}`} onClick={() => {}}>
                Delete
            </button>
        </div>
    )),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('TodoPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const consoleLog = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    it('should render loading state initially', () => {
        (fetchLists as jest.Mock).mockReturnValue(new Promise(() => {}));

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display todo lists after loading', async () => {
        const mockLists = [
            { id: 1, title: 'List 1', tasks: [] },
            { id: 2, title: 'List 2', tasks: [] },
        ];

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
            expect(screen.getByTestId('todo-list-2')).toBeInTheDocument();
        });

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should display error message when fetching fails', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const error = new Error('Failed to fetch');

        (fetchLists as jest.Mock).mockRejectedValue(error);

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load todo lists')
            ).toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching todo lists:',
            error
        );
        consoleErrorSpy.mockRestore();
    });

    it('should show "No lists available" when there are no lists', async () => {
        (fetchLists as jest.Mock).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No lists available')).toBeInTheDocument();
        });
    });

    it('should create a new list when form is submitted', async () => {
        const mockLists = [{ id: 1, title: 'List 1', tasks: [] }];
        const newList = { id: 2, title: 'New List', tasks: [] };

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });
        (createList as jest.Mock).mockResolvedValue({ data: newList });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
        });

        // Fill in the form and submit
        const input = screen.getByLabelText('New list title');
        const button = screen.getByText('Add List');

        await waitFor(async () => {
            await userEvent.type(input, 'New List');
        });

        await waitFor(async () => {
            await userEvent.click(button);
        });

        await waitFor(() => {
            expect(createList).toHaveBeenCalledWith('New List');
            expect(screen.getByTestId('todo-list-2')).toBeInTheDocument();
        });

        // Input should be cleared
        expect(input).toHaveValue('');
    });

    it('should not create a list if title is empty', async () => {
        const mockLists = [{ id: 1, title: 'List 1', tasks: [] }];

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
        });

        // Click add without typing anything
        const button = screen.getByText('Add List');

        await waitFor(async () => {
            await userEvent.click(button);
        });

        expect(createList).not.toHaveBeenCalled();
    });

    it('should delete a list when delete button is clicked', async () => {
        const mockLists = [
            { id: 1, title: 'List 1', tasks: [] },
            { id: 2, title: 'List 2', tasks: [] },
        ];

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });
        (deleteList as jest.Mock).mockResolvedValue({});

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
            expect(screen.getByTestId('todo-list-2')).toBeInTheDocument();
        });

        // The TodoList component is mocked, so we need to simulate the onDelete callback
        const component = require('@/entities/TodoList');
        const mockOnDelete = component.TodoList.mock.calls[0][0].onDelete;

        await waitFor(async () => {
            await mockOnDelete(1);
        });

        expect(deleteList).toHaveBeenCalledWith(1);

        // After state update, list with id 1 should be removed
        await waitFor(() => {
            expect(screen.queryByTestId('todo-list-1')).not.toBeInTheDocument();
            expect(screen.getByTestId('todo-list-2')).toBeInTheDocument();
        });
    });

    it('should logout when logout button is clicked', async () => {
        const mockLists = [{ id: 1, title: 'List 1', tasks: [] }];

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
        });

        const logoutButton = screen.getByLabelText('delete');

        await waitFor(async () => {
            await userEvent.click(logoutButton);
        });

        expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should update list when onUpdate is called', async () => {
        const mockLists = [
            { id: 1, title: 'List 1', tasks: [] },
            { id: 2, title: 'List 2', tasks: [] },
        ];

        const updatedList = { id: 1, title: 'Updated List 1', tasks: [] };

        (fetchLists as jest.Mock).mockResolvedValue({ data: mockLists });

        render(
            <MemoryRouter>
                <TodoPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('todo-list-1')).toBeInTheDocument();
        });

        // Get the onUpdate callback from the mocked TodoList
        const component = require('@/entities/TodoList');
        const mockOnUpdate = component.TodoList.mock.calls[0][0].onUpdate;

        // Call onUpdate with the updated list
        await waitFor(async () => {
            await mockOnUpdate(updatedList);
        });

        // The TodoList component is mocked, so we can't directly test the UI update
        // But we can verify that the component was called with updated props in a new render
        const updatedCalls = component.TodoList.mock.calls.filter(
            (call: any) => call[0].list.id === 1
        );

        expect(updatedCalls[updatedCalls.length - 1][0].list.title).toBe(
            'Updated List 1'
        );
    });
});
