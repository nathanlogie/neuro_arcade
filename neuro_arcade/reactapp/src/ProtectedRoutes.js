import {isLoggedIn, getUserStatus, userIsAdmin, isOwner} from "./backendRequests";
import {EditAbout} from "./app/about/EditAbout";
import {Navigate} from "react-router-dom";
import { PageNotFound } from "./app/PageNotFound";

/**
 * Protected Routes for urls that require some restriction
 * @param children - The JSX Element to return if condition is satisfied
 *
 * @returns {children | PageNotFound | Navigate} depending on outcome
 */

/**
 * Protected routes for routes that only require a login
 * Redirects to login page if user is not logged in
 */
export function LoginRoutes({children}){
    if (!isLoggedIn()){
        return <Navigate to={'/login'} />
    }
    return children;
}

/**
 * Protected routes for routes that require an approved user
 */
export function ApprovedRoutes({children}){
    if((!isLoggedIn() || getUserStatus()!=='approved') && !userIsAdmin()){
        return <PageNotFound />
    }
    return children;
}

/**
 * Protected routes for routes that require an admin
 * @param children - The JSX Element returned if the user is an admin
 * @returns {React.JSX.Element|*} - Returns child element if an admin, otherwise returns PageNotFound
 */
export function AdminRoutes({children}){
    if (!userIsAdmin()){
        return <PageNotFound />
    }
    return children;
}

/**
 * Protected routes for routes that require an admin
 * @param children - The JSX Element returned if the user is not an admin
 * @returns {React.JSX.Element|*} - Returns child element if user is not an admin, returns EditAbout otherwise
 */
export function EditRoute({children}){
    if (isLoggedIn() && userIsAdmin()){
        return <EditAbout />
    }
    return children;
}

/**
 * Protected Route for edit game pages requiring ownership
 */
export function GameOwnerRoute({children}){
    if (!isOwner("game")){
        return <PageNotFound/>
    }
    return children;
}

/**
 * Protected Route for edit game pages requiring ownership
 */
export function PlayerOwnerRoute({children}){
    if (!isOwner("player")){
        return <PageNotFound/>
    }
    return children;
}
