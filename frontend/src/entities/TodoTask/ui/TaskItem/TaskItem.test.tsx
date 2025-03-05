import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskItem } from './TaskItem';
import { TodoTask } from '../../model/types/TodoTask';

describe('TaskItem Component', () => {
    const mockTask: TodoTask = {
        id: 1,
        title: 'Test Task',
        completed: false,
        listId: 1,
    };

    const onToggleComplete = jest.fn();
    const onDelete = jest.fn();
    const onUpdateTitle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders task with correct title and state', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('calls onToggleComplete when checkbox is clicked', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        fireEvent.click(screen.getByRole('checkbox'));
        expect(onToggleComplete).toHaveBeenCalledWith(mockTask.id);
    });

    test('calls onDelete when delete button is clicked', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        fireEvent.click(screen.getByLabelText('delete'));
        expect(onDelete).toHaveBeenCalledWith(mockTask.id);
    });

    test('enters edit mode when edit button is clicked', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        fireEvent.click(screen.getByLabelText('edit'));
        expect(screen.getByRole('textbox')).toHaveValue('Test Task');
    });

    test('updates task title and exits edit mode when apply button is clicked', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        fireEvent.click(screen.getByLabelText('edit'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Updated Task' },
        });
        fireEvent.click(screen.getByLabelText('apply'));

        expect(onUpdateTitle).toHaveBeenCalledWith(mockTask.id, 'Updated Task');
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('cancels edit mode without updating title when cancel button is clicked', () => {
        render(
            <TaskItem
                task={mockTask}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
            />
        );

        fireEvent.click(screen.getByLabelText('edit'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Updated Task' },
        });
        fireEvent.click(screen.getByLabelText('cancel'));

        expect(onUpdateTitle).not.toHaveBeenCalled();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
});
