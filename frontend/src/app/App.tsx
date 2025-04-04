import { memo } from 'react';
import './styles/index.scss';
import { AppRouter } from './providers/RouterProvider/';

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
