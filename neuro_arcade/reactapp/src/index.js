import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AddContent} from "./app/AddContent";
import {MoreGames} from "./app/MoreGames";
import {GameView} from "./app/GameView";


const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage />
    },
    {
        path: "about",
        element: <AboutPage />
    },
    {
        path: "add_content",
        element: (
            <AddContent />
        ),
    },
    {
        path: 'all_games/:game_slug',
        element: <GameView />
    },
    {
        path: "all_games",
        element: <MoreGames />
    },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
