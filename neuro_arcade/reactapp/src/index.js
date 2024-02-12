import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/about/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AddContent} from "./app/add_content/AddContent";
import {FormPage} from "./app/add_content/FormPage";
import {AllGames} from "./app/AllGames";
import {GameView} from "./app/GameView";
import {AllPlayers} from './app/AllPlayers';
import { EditAbout } from "./app/about/EditAbout";
import {AnimatePresence} from 'framer-motion'
import {Background} from "./components/Background";

const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage/>
    },
    {
        path: "about",
        element: <AboutPage />,

    },
    {

        path: "edit_about",
        element: <EditAbout />

    },
    {
        path: "add_content",
        element: (
            <AddContent/>
        ),
    },
    {
        path: "add_game",
        element: <FormPage type={'game'} />
    },
    {
        path: "add_player",
        element: <FormPage type={'player/model'} />
    },
    {
        path: 'all_games/:game_slug',
        element: <GameView/>
    },
    {
        path: "all_games",
        element: <AllGames/>
    },
    {
        path: "all_players",
        element: <AllPlayers/>
    },
]);


createRoot(document.getElementById('root')).render(
    <>
        <Background />
        <AnimatePresence>
            <RouterProvider router={router}/>
        </AnimatePresence>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
