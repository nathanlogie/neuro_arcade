import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import App from './app/App';
import reportWebVitals from './app/reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
    Link,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "react_test", // TODO change to / after everything is moved
        element: (
            <div>
                <App />
                <Link to="other_page">other page</Link>
            </div>
        ),
    },
    {
        path: "react_test/other_page",  // TODO change to / after everything is moved
        element: (
            <div>Other Page</div>
        ),
    },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
