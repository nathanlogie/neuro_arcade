import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AddContent} from "./app/AddContent";


const router = createBrowserRouter([
    {
        path: '',
        element: (
            <div>
                <HomePage />
            </div>
        ),
    },
    {
        path: "about",
        element: (
            <div>
                <AboutPage />
            </div>
        ),
    },
        {
        path: "add_content",
        element: (
            <div>
                <AddContent />
            </div>
        ),
    },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
