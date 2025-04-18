import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { loginUser, registerUser } from '@/entities/User';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await registerUser(username, password);
            console.log('Registration successful:', response.data);
            const loginResponse = await loginUser(username, password);
            localStorage.setItem('token', loginResponse.data.token);
            navigate('/todos');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Register
            </Button>
        </Box>
    );
};
