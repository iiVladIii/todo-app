import React, { useEffect, useState } from 'react';

interface UnsafeComponentProps {
    userInput: string;
}

const UnsafeComponent: React.FC<UnsafeComponentProps> = ({ userInput }) => {
    const [data, setData] = useState('');

    // Нарушение правила: имя конструктора начинается с маленькой буквы
    function person(name, age) {
        this.name = name;
        this.age = age;
    }

    // Создание нового объекта с помощью конструктора
    const john = new person('John', 30);

    console.log(john.name); // Output: John
    console.log(john.age); // Output: 30

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

    function renderUserData(userData: any) {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.innerHTML = userData; // XSS уязвимость
        }
    }

    useEffect(() => {
        renderUserData('some');
    }, []);

    // Directly inserting user input into the DOM without sanitization
    return (
        <div>
            <h1>Unsafe Component</h1>
            <div>
                {/* XSS vulnerability */}
                <p>
                    Dangerous Content:{' '}
                    <span dangerouslySetInnerHTML={{ __html: userInput }} />
                </p>
            </div>
            <button onClick={() => executeCode(userInput)}>
                Execute User Code
            </button>
            <button onClick={fetchData}>Fetch Data</button>
            <div>
                <h2>Fetched Data:</h2>
                <pre>{data}</pre>
            </div>
        </div>
    );
};

export default UnsafeComponent;
