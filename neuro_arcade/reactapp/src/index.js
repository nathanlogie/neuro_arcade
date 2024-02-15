import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/about/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AccountPage} from "./app/user_account/AccountPage";
import {FormPage} from "./app/user_account/FormPage";
import {AllGames} from "./app/AllGames";
import {GameView} from "./app/GameView";
import {SignUp} from "./app/SignUp";
import {Login} from "./app/Login";
import {AllPlayers} from './app/AllPlayers';
import {EditAbout} from "./app/about/EditAbout";
import {AnimatePresence} from 'framer-motion'
import {Background} from "./components/Background";
import {AuthTest} from "./app/AuthTest";
import {AllUsers} from "./app/user_account/AllUsers"

const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage/>
    },
    {
        path: "about",
        element: <AboutPage/>,
    },
    {
        path: "edit_about",
        element: <EditAbout/>
    },
    {
        path: "user_account", //TODO slug for users
        element: (
            <AccountPage/>
        )
    },
    {
        path: "user_account/all_users",
        element: <AllUsers />
    },
    {
        path: "add_game",
        element: <FormPage type={'game'} />
    },
    {
        path: "add_model",
        element: <FormPage type={'model'} />
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
        path: "sign_up",
        element: <SignUp/>
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "auth_test",
        element: <AuthTest />
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
