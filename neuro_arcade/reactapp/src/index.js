import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
    Link,
} from "react-router-dom";
import {Background} from "./components/Background";


const router = createBrowserRouter([
    {
        path: "react_test", // TODO change to / after everything is moved
        element: (
            <div>
                <HomePage />
            </div>
        ),
    },
    {
        path: "react_test/about",  // TODO change to / after everything is moved
        element: (
            <div>
                <AboutPage />
            </div>
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
