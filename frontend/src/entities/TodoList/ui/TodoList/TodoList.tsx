import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    List,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    createTask,
    deleteTask,
    fetchTasks,
    TaskItem,
    TodoTask,
    updateTask,
} from '@/entities/TodoTask';
import styles from './TodoList.module.scss';
import { TodoList as TodoListType } from '../../model/types/TodoList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { updateList } from '../../model/services/updateList/updateList';

interface TodoListProps {
    list: TodoListType;
    onDelete: (taskId: number) => void;
    onUpdate: (list: TodoListType) => void;
}

export const TodoList: React.FC<TodoListProps> = React.memo(
    ({ list, onDelete, onUpdate }) => {
        const [tasks, setTasks] = useState<TodoTask[]>([]);
        const [newTaskTitle, setNewTaskTitle] = useState('');
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [editListName, setEditListName] = useState(list.name);
        const [isEditing, setIsEditing] = useState(false);

        useEffect(() => {
            const loadTasks = async () => {
                try {
                    const response = await fetchTasks(list.id);
                    if (!response.data) {
                        throw new Error('No tasks available');
                    }
                    setTasks(response.data);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                    setError('Failed to load tasks');
                } finally {
                    setLoading(false);
                }
            };

            loadTasks();
        }, [list.id]);

        const handleAddTask = async () => {
            if (!newTaskTitle) return;

            try {
                const response = await createTask(list.id, newTaskTitle);
                setTasks((prevTasks) => [...prevTasks, response.data]);
                setNewTaskTitle('');
            } catch (error) {
                console.error('Error creating task:', error);
                setError('Failed to create task');
            }
        };

        const handleToggleComplete = async (taskId: number) => {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;

            try {
                const response = await updateTask({
                    taskId: taskId,
                    title: task.title,
                    completed: !task.completed,
                });
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t.id === taskId ? response.data : t))
                );
            } catch (error) {
                console.error('Error updating task:', error);
                setError('Failed to update task');
            }
        };
        const handleUpdateTask = async (taskId: number, newTitle: string) => {
            const task = tasks.find((t) => t.id === taskId);
            if (!task) return;

            try {
                const response = await updateTask({
                    taskId: taskId,
                    title: newTitle,
                    completed: task.completed,
                });
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t.id === taskId ? response.data : t))
                );
            } catch (error) {
                console.error('Error updating task:', error);
                setError('Failed to update task');
            }
        };

        const handleDeleteTask = async (taskId: number) => {
            try {
                await deleteTask(taskId);
                setTasks((prevTasks) =>
                    prevTasks.filter((t) => t.id !== taskId)
                );
            } catch (error) {
                console.error('Error deleting task:', error);
                setError('Failed to delete task');
            }
        };

        const handleUpdateListName = async () => {
            try {
                await updateList(list.id, editListName);
                setIsEditing(false);
                onUpdate({ ...list, name: editListName });
            } catch (error) {
                console.error('Error updating list name:', error);
                setError('Failed to update list name');
            }
        };

        return (
            <Paper className={styles.todoList} sx={{ p: 2, mb: 2 }}>
                <div className={styles.header}>
                    {isEditing ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            value={editListName}
                            onChange={(e) => setEditListName(e.target.value)}
                            sx={{ mr: 2 }}
                        />
                    ) : (
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {list.name}
                        </Typography>
                    )}

                    <div className={styles.bts}>
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            style={{ marginRight: 2 }}
                            onClick={() => {
                                if (isEditing) {
                                    handleUpdateListName();
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                        >
                            {isEditing ? <CheckIcon /> : <EditIcon />}
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            style={{ marginRight: 2 }}
                            onClick={() => onDelete(list.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && tasks.length === 0 && (
                    <Typography>No tasks available</Typography>
                )}
                <List>
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleComplete}
                            onDelete={handleDeleteTask}
                            onUpdateTitle={handleUpdateTask}
                        />
                    ))}
                </List>
                <TextField
                    label="New task"
                    variant="outlined"
                    fullWidth
                    size={'small'}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTask}
                    sx={{ mt: 1 }}
                >
                    Add Task
                </Button>
            </Paper>
        );
    }
);
