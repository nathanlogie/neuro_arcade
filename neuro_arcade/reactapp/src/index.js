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
import {PlayerView} from './app/PlayerView';
import { EditAbout } from "./app/about/EditAbout";
import {PageNotFound} from "./app/PageNotFound"
import {AnimatePresence} from 'framer-motion'
import {Background} from "./components/Background";
import {AuthTest} from "./app/AuthTest";
import {AllUsers} from "./app/user_account/AllUsers"
import {isLoggedIn, getUserStatus, userIsAdmin} from "./backendRequests";

export function LoginRoutes({children}){
    if (!isLoggedIn()){
        return <Navigate to={'/login'} />
    }
    return children;
};

export function ApprovedRoutes({children}){
    if((!isLoggedIn() || getUserStatus()!=='approved') && !userIsAdmin()){
        return <PageNotFound />
    }
    return children;
}

export function AdminRoutes({children}){
    if (!userIsAdmin()){
        return <PageNotFound />
    }
    return children;
}

export function EditRoute({children}){
    if (isLoggedIn() && userIsAdmin()){
        return <EditAbout />
    }
    return children;
}

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
        path: "user_account", //TODO slug for users
        element:
            <LoginRoutes>
                <AccountPage />
            </LoginRoutes>
    },
    {
        path: "user_account/all_users",
        element:
            <AdminRoutes>
                <AllUsers />
            </AdminRoutes>
    },
    {
        path: "add_game",
        element:
            <ApprovedRoutes>
                <FormPage type={'game'}/>
            </ApprovedRoutes>
    },
    {
        path: "add_model",
        element:
            <ApprovedRoutes>
                <FormPage type={'model'}/>
            </ApprovedRoutes>
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
        path: "all_players/:player_slug",
        element: <PlayerView/>
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
