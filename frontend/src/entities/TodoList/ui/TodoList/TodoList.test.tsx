import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoList } from './TodoList';
import {
    createTask,
    deleteTask,
    fetchTasks,
    updateTask,
} from '@/entities/TodoTask';
import { updateList } from '../../model/services/updateList/updateList';

// Mock the dependencies
jest.mock('@/entities/TodoTask', () => ({
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    fetchTasks: jest.fn(),
    updateTask: jest.fn(),
    TaskItem: ({ task, onToggleComplete, onDelete, onUpdateTitle }) => (
        <div data-testid={`task-${task.id}`}>
            <span>{task.title}</span>
            <button onClick={() => onToggleComplete(task.id)}>Toggle</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
            <button onClick={() => onUpdateTitle(task.id, 'Updated Title')}>
                Update
            </button>
        </div>
    ),
}));

jest.mock('../../model/services/updateList/updateList', () => ({
    updateList: jest.fn(),
}));

describe('TodoList Component', () => {
    const mockList = {
        id: 1,
        name: 'Test List',
    };

    const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
    ];

    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        fetchTasks.mockResolvedValue({ data: mockTasks });
    });

    it('should render loading state initially', () => {
        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render tasks after loading', async () => {
        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(screen.getByTestId('task-1')).toBeInTheDocument();
            expect(screen.getByTestId('task-2')).toBeInTheDocument();
        });
    });

    it('should show error message when task fetch fails', async () => {
        fetchTasks.mockRejectedValueOnce(new Error('Failed to fetch'));

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load tasks')
            ).toBeInTheDocument();
        });
    });

    it('should show "No tasks available" when no tasks are returned', async () => {
        fetchTasks.mockResolvedValueOnce({ data: [] });

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No tasks available')).toBeInTheDocument();
        });
    });

    it('should add a new task', async () => {
        createTask.mockResolvedValueOnce({
            data: { id: 3, title: 'New Task', completed: false },
        });

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('New task'), {
            target: { value: 'New Task' },
        });
        fireEvent.click(screen.getByText('Add Task'));

        await waitFor(() => {
            expect(createTask).toHaveBeenCalledWith(1, 'New Task');
        });
    });

    it('should not add a task when input is empty', async () => {
        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Add Task'));

        expect(createTask).not.toHaveBeenCalled();
    });

    it('should toggle task completion', async () => {
        updateTask.mockResolvedValueOnce({
            data: { id: 1, title: 'Task 1', completed: true },
        });

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Toggle')[0]);

        await waitFor(() => {
            expect(updateTask).toHaveBeenCalledWith({
                taskId: 1,
                title: 'Task 1',
                completed: true,
            });
        });
    });

    it('should update task title', async () => {
        updateTask.mockResolvedValueOnce({
            data: { id: 1, title: 'Updated Title', completed: false },
        });

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Update')[0]);

        await waitFor(() => {
            expect(updateTask).toHaveBeenCalledWith({
                taskId: 1,
                title: 'Updated Title',
                completed: false,
            });
        });
    });

    it('should delete a task', async () => {
        deleteTask.mockResolvedValueOnce({});

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => {
            expect(deleteTask).toHaveBeenCalledWith(1);
        });
    });

    it('should enter edit mode for list name', async () => {
        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByLabelText('edit'));

        expect(screen.getByDisplayValue('Test List')).toBeInTheDocument();
    });

    it('should update list name', async () => {
        updateList.mockResolvedValueOnce({});

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Enter edit mode
        fireEvent.click(screen.getByLabelText('edit'));

        // Change the list name
        fireEvent.change(screen.getByDisplayValue('Test List'), {
            target: { value: 'Updated List Name' },
        });

        // Save the changes
        fireEvent.click(screen.getByLabelText('edit'));

        await waitFor(() => {
            expect(updateList).toHaveBeenCalledWith(1, 'Updated List Name');
            expect(mockOnUpdate).toHaveBeenCalledWith({
                id: 1,
                name: 'Updated List Name',
            });
        });
    });

    it('should delete the list', async () => {
        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByLabelText('delete'));

        expect(mockOnDelete).toHaveBeenCalledWith(1);
    });

    it('should handle error when creating a task', async () => {
        createTask.mockRejectedValueOnce(new Error('Failed to create'));

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText('New task'), {
            target: { value: 'New Task' },
        });
        fireEvent.click(screen.getByText('Add Task'));

        await waitFor(() => {
            expect(
                screen.getByText('Failed to create task')
            ).toBeInTheDocument();
        });
    });

    it('should handle error when updating a task', async () => {
        updateTask.mockRejectedValueOnce(new Error('Failed to update'));

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Toggle')[0]);

        await waitFor(() => {
            expect(
                screen.getByText('Failed to update task')
            ).toBeInTheDocument();
        });
    });

    it('should handle error when deleting a task', async () => {
        deleteTask.mockRejectedValueOnce(new Error('Failed to delete'));

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => {
            expect(
                screen.getByText('Failed to delete task')
            ).toBeInTheDocument();
        });
    });

    it('should handle error when updating list name', async () => {
        updateList.mockRejectedValueOnce(new Error('Failed to update list'));

        render(
            <TodoList
                list={mockList}
                onDelete={mockOnDelete}
                onUpdate={mockOnUpdate}
            />
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Enter edit mode
        fireEvent.click(screen.getByLabelText('edit'));

        // Change the list name
        fireEvent.change(screen.getByDisplayValue('Test List'), {
            target: { value: 'Updated List Name' },
        });

        // Save the changes
        fireEvent.click(screen.getByLabelText('edit'));

        await waitFor(() => {
            expect(
                screen.getByText('Failed to update list name')
            ).toBeInTheDocument();
        });
    });
});
