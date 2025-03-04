import { memo } from 'react';

interface AppProps {
    className?: string;
}

export const App = memo((props: AppProps) => {
    const { className } = props;

    return <div className={'1'}>app</div>;
});
