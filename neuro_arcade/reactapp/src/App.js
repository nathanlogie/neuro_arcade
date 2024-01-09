import './App.css';
import {useEffect, useState} from "react";

function Fibbonacci() {
    const api_url = '/react_test/api/';

    const [data, setData] = useState('nothing');

    const options_body = {
        'skip': '0',
        'numbers:': '12',
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options_body),
    };

    useEffect(() => {
        fetch(api_url, options)
            .then(response => {
                if (response.ok) {
                    return response.json(); // parse JSON data
                } else {
                    throw new Error('Response was not ok');
                }
            })
            .then(jsonData => {
                setData(JSON.stringify(jsonData, null, 2));
            })
            .catch(error => {
                console.error('Error:', error);
                setData('Error occurred!');
            });
    }, []);

    return (
        <p>Fibonacci's sequence: {data}</p>
    );
}

function App() {
    return (
        <div className="App">
            <p>hi!</p>
            <Fibbonacci />
        </div>
    );
}

export default App;
