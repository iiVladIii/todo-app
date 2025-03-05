import React, { useState } from 'react';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TodoTask } from '../../model/types/TodoTask';

interface TaskItemProps {
    task: TodoTask;
    onToggleComplete: (taskId: number) => void;
    onDelete: (taskId: number) => void;
    onUpdateTitle: (taskId: number, newTitle: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = React.memo(
    ({ task, onToggleComplete, onDelete, onUpdateTitle }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editTitle, setEditTitle] = useState(task.title);

        const handleEditClick = () => {
            setIsEditing(true);
        };

        const handleApplyClick = () => {
            onUpdateTitle(task.id, editTitle);
            setIsEditing(false);
        };

        const handleCancelClick = () => {
            setEditTitle(task.title); // Сбросить изменения
            setIsEditing(false);
        };

        return (
            <ListItem
                secondaryAction={
                    <>
                        {isEditing ? (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="apply"
                                    onClick={handleApplyClick}
                                >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="cancel"
                                    onClick={handleCancelClick}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={handleEditClick}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => onDelete(task.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </>
                }
            >
                <Checkbox
                    edge="start"
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                    onChange={() => onToggleComplete(task.id)}
                />
                {isEditing ? (
                    <TextField
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                ) : (
                    <ListItemText primary={task.title} />
                )}
            </ListItem>
        );
    }
);
