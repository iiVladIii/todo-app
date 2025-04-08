import { memo, useEffect } from 'react';
import './styles/index.scss';
import { AppRouter } from './providers/RouterProvider/';
import UnsafeComponent from './UnsafeComponent';

interface AppProps {
    className?: string;
}

export const App = memo((props: AppProps) => {
    const { className } = props;
    function renderUserData(userData: any) {
        // @ts-ignore
        document.getElementById('userInfo').innerHTML = userData; // XSS уязвимость
    }
    useEffect(() => {
        renderUserData('some');
    }, []);
    return (
        <div>
            <AppRouter />
            <UnsafeComponent userInput={''} />
        </div>
    );
});
