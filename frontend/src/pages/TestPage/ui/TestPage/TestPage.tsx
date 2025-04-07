import React, { useState } from 'react';
import { memo } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { Login, Register } from '@/features/auth';

interface AuthPageProps {
    className?: string;
}

export const TestPage = memo((props: AuthPageProps) => {
    const { className } = props;
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box
            className={className}
            sx={{ maxWidth: 400, margin: '0 auto', paddingTop: 4 }}
        >
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
            >
                <Tab label="Login" />
                <Tab label="Register" />
            </Tabs>
            <Box sx={{ padding: 2 }}>
                {activeTab === 0 && <Login />}
                {activeTab === 1 && <Register />}
            </Box>
        </Box>
    );
});
