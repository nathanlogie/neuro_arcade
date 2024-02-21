import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/about/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {AccountPage} from "./app/user_account/AccountPage";
import {FormPage} from "./app/user_account/FormPage";
import {AllGames} from "./app/AllGames";
import {GameView} from "./app/GameView";
import {SignUp} from "./app/SignUp";
import {Login} from "./app/Login";
import {AllPlayers} from './app/AllPlayers';
import {PageNotFound} from "./app/PageNotFound"
import {AnimatePresence} from 'framer-motion'
import {Background} from "./components/Background";
import {AuthTest} from "./app/AuthTest";
import {AllUsers} from "./app/user_account/AllUsers"
import {isLoggedIn, getUserStatus, userIsAdmin} from "./backendRequests";
import {EditAbout} from "./app/about/EditAbout";

let about = <AboutPage />;
let addGame = <PageNotFound />;
let addModel = <PageNotFound />;
let allUsers = <PageNotFound />;
let userAccount = <Navigate to={'/login'} />

if (isLoggedIn()){
    userAccount = <AccountPage />
    if (userIsAdmin()) {
        about = <EditAbout />;
        allUsers = <AllUsers />
    }

    if (getUserStatus()==="approved" || userIsAdmin()){
        addGame = <FormPage type={'game'} />
        addModel = <FormPage type={'model'} />
    }

}



const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage/>
    },
    {
        path: "about",
        element: about,
    },
    {
        path: "user_account", //TODO slug for users
        element: (
            userAccount
        )
    },
    {
        path: "user_account/all_users",
        element: allUsers
    },
    {
        path: "add_game",
        element: addGame
    },
    {
        path: "add_model",
        element: addModel
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
    {
        path: "*",
        element: <PageNotFound />
    }
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
