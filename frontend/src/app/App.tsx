import { memo } from 'react';
import './styles/index.scss';
import { AppRouter } from './providers/RouterProvider/';

interface AppProps {
    className?: string;
}

export const App = memo((props: AppProps) => {
    const { className } = props;
    function renderUserData(userData: any) {
        // @ts-ignore
        document.getElementById('userInfo').innerHTML = userData; // XSS уязвимость
    }
    return (
        <div>
            <AppRouter />
        </div>
    );
});
