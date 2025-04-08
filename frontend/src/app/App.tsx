import { memo, useEffect } from 'react';
import './styles/index.scss';
import { AppRouter } from './providers/RouterProvider/';
import UnsafeComponent from './UnsafeComponent';

interface AppProps {
    className?: string;
}

export const App = memo((props: AppProps) => {
    const { className } = props;

    return (
        <div>
            <AppRouter />
        </div>
    );
});
