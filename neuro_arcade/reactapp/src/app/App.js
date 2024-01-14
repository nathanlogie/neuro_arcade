import '../styles/App.css';
import {useEffect, useState} from "react";
import {Background} from "../components/Background";
import {Index} from "../components/Index";

function Fibbonacci() {
    // URL used to fetch the data
    const api_url = '/react_test/api/';
    // initialising a Component state
    //  data    - value inside the state
    //  setData - setter function for the state
    const [data, setData] = useState('nothing');

    // Body of the API call
    // Think of these as method arguments
    const options_body = {
        'skip': '0',
        'numbers:': '12',
    };
    // Rest of the request
    const options = {
        // what HTTP method to use:
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body needs to be made into a string to be valid
        body: JSON.stringify(options_body),
    };

    // useEffect sets a function that can update the state
    // "() => {...}" is an lambda function with no arguments
    // we could have passed a normal function as an argument
    useEffect(() => {
        // fetch sends 'options' at 'api_url'
        fetch(api_url, options)
            // 1. We check if we got a valid Response
            .then(response => {
                if (response.ok) {
                    return response.json(); // parse JSON data
                } else {
                    throw new Error('Response was not ok');
                }
            })
            // 2. update the data state using the 'setData' setter got earlier
            .then(jsonData => {
                // remember that data is a string so jsonData needs to be stringify
                setData(JSON.stringify(jsonData, null, 2));
            })
            // Catching any errors that would show up
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
            {/*<Fibbonacci />*/}

            <Background />
            <Index />
        </div>
    );
}

export default App;
