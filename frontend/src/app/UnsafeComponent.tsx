import React, { useState } from 'react';

interface UnsafeComponentProps {
    userInput: string;
}

const UnsafeComponent: React.FC<UnsafeComponentProps> = ({ userInput }) => {
    const [data, setData] = useState('');

    // Insecure method due to use of eval
    const executeCode = (code: string) => {
        try {
            // Dangerous: eval can execute arbitrary code
            eval(code);
        } catch (error) {
            console.error('Error executing code:', error);
        }
    };

    // Insecure HTTP request
    const fetchData = async () => {
        try {
            // Insecure: No validation or security headers
            const response = await fetch('http://example.com/api/data');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Directly inserting user input into the DOM without sanitization
    return (
        <div>
            <h1>Unsafe Component</h1>
            <div>
                {/* XSS vulnerability */}
                <p>Dangerous Content: <span dangerouslySetInnerHTML={{ __html: userInput }} /></p>
            </div>
            <button onClick={() => executeCode(userInput)}>Execute User Code</button>
            <button onClick={fetchData}>Fetch Data</button>
            <div>
                <h2>Fetched Data:</h2>
                <pre>{data}</pre>
            </div>
        </div>
    );
};

export default UnsafeComponent;
