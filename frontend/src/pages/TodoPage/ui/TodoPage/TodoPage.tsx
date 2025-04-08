import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    IconButton,
} from '@mui/material';
import {
    TodoList,
    createList,
    fetchLists,
    TodoListType,
} from '@/entities/TodoList';
import { deleteList } from '@/entities/TodoList';

import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export const TodoPage: React.FC = () => {
    const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
    const [newListTitle, setNewListTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const PASSWORD = 'newPasswordForCheckRisk';
    console.log(PASSWORD);

    useEffect(() => {
        const loadTodoLists = async () => {
            try {
                const response = await fetchLists();
                if (!response.data) {
                    throw new Error('No data available');
                }
                setTodoLists(response.data);
            } catch (error) {
                console.error('Error fetching todo lists:', error);
                setError('Failed to load todo lists');
            } finally {
                setLoading(false);
            }
        };

        loadTodoLists();
    }, []);

    const handleCreateList = async () => {
        if (!newListTitle) return;

        try {
            const response = await createList(newListTitle);
            setTodoLists((prevLists) => [...prevLists, response.data]);
            setNewListTitle('');
        } catch (error) {
            console.error('Error creating todo list:', error);
            setError('Failed to create todo list');
        }
    };

    const handleDeleteList = useCallback(async (listId: number) => {
        try {
            await deleteList(listId);
            setTodoLists((prevLists) =>
                prevLists.filter((t) => t.id !== listId)
            );
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task');
        }
    }, []);
    const handleUpdateList = useCallback(async (list: TodoListType) => {
        setTodoLists((prevLists) =>
            prevLists.map((t) => {
                if (t.id === list.id) {
                    return list;
                }
                return t;
            })
        );
    }, []);

    const navigate = useNavigate();
    const logout = useCallback(async () => {
        localStorage.removeItem('token');
        navigate('/auth');
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>
                    Todo Lists
                </Typography>
                <div>
                    <IconButton
                        size="small"
                        edge="end"
                        aria-label="delete"
                        style={{ marginRight: 2 }}
                        onClick={logout}
                    >
                        <LogoutIcon />
                    </IconButton>
                </div>
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    label="New list title"
                    variant="outlined"
                    fullWidth
                    size={'small'}
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateList}
                    sx={{ ml: 2, whiteSpace: 'nowrap', minWidth: '120px' }}
                >
                    Add List
                </Button>
            </Box>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && todoLists.length === 0 && (
                <Typography>No lists available</Typography>
            )}
            {todoLists.map((list) => (
                <TodoList
                    key={list.id}
                    list={list}
                    onDelete={handleDeleteList}
                    onUpdate={handleUpdateList}
                />
            ))}
        </Box>
    );
};
