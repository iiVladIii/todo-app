import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { TodoPage } from '@/pages/TodoPage';
import UnsafeComponent from '@/app/UnsafeComponent';

export const AppRouter = () => {
    const navigate = useNavigate();
    const hasToken = Boolean(localStorage.getItem('token'));

    useEffect(() => {
        if (hasToken) {
            navigate('/todos');
        }
    }, [hasToken, navigate]);

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/error" element={<UnsafeComponent userInput={''} />} />
            {hasToken && <Route path="/todos" element={<TodoPage />} />}
            {!hasToken && <Route path="*" element={<Navigate to="/auth" />} />}
        </Routes>
    );
};
