import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/about/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, Navigate, RouterProvider, useParams} from "react-router-dom";
import {AccountPage} from "./app/user_account/AccountPage";
import {FormPage} from "./app/user_account/FormPage";
import {AllGames} from "./app/AllGames";
import {GameView} from "./app/GameView";
import {SignUp} from "./app/SignUp";
import {Login} from "./app/Login";
import {AllPlayers} from './app/AllPlayers';
import {PlayerView} from './app/PlayerView';
import {PageNotFound} from "./app/PageNotFound"
import {AnimatePresence} from 'framer-motion'
import {Background} from "./components/Background";
import {AuthTest} from "./app/AuthTest";
import {AllUsers} from "./app/user_account/AllUsers"
import {LoginRoutes, EditRoute, ApprovedRoutes, AdminRoutes, GameOwnerRoute, PlayerOwnerRoute} from "./ProtectedRoutes"

const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage/>
    },
    {
        path: "about",
        element:
            <EditRoute>
                <AboutPage/>
            </EditRoute>
    },
    {
        path: "user-account",
        element:
            <LoginRoutes>
                <AccountPage/>
            </LoginRoutes>
    },
    {
        path: "user-account/all_users",
        element:
            <AdminRoutes>
                <AllUsers/>
            </AdminRoutes>
    },
    {
        path: "add-game",
        element:
            <ApprovedRoutes>
                <FormPage type={'game'}/>
            </ApprovedRoutes>
    },
    {
        path: "add-model",
        element:
            <ApprovedRoutes>
                <FormPage type={'model'}/>
            </ApprovedRoutes>
    },
    {
        path: 'all-games/:game_slug',
        element: <GameView/>
    },
    {
        path: 'all-games/:game_slug/upload-scores',
        element:
            <ApprovedRoutes>
                <FormPage type={'score'} />
            </ApprovedRoutes>
    },
    {
        path: 'all-players/:player_slug/edit',
        element:
            <PlayerOwnerRoute>
                <FormPage type={'modelUpdate'}/>
            </PlayerOwnerRoute>
    },
    {
        path: 'all-games/:game_slug/edit',
        element:
            <GameOwnerRoute>
                <FormPage type={'gameUpdate'}/>
            </GameOwnerRoute>
    },
    {
        path: "all-games",
        element: <AllGames/>
    },
    {
        path: "sign-up",
        element: <SignUp/>
    },
    {
        path: "login",
        element: <Login/>
    },
    {
        path: "auth_test",
        element: <AuthTest/>
    },
    {
        path: "all-players",
        element: <AllPlayers/>
    },
    {
        path: "all-players/:player_slug",
        element: <PlayerView/>
    },
    {
        path: "*",
        element: <PageNotFound/>
    }
]);


createRoot(document.getElementById('root')).render(
    <>
        <Background/>
        <AnimatePresence>
            <RouterProvider router={router}/>
        </AnimatePresence>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
