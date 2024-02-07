import axios from "axios";

const API_ROOT = "http://localhost:8000"

/**
 * This file contains functions that request or upload data from/to the backend
 */

/**
 * Requests the data associated with a game.
 *
 * @param {string} gameName
 *
 * @return response data
 *
 * @throws Error when the request is rejected.
 */
export async function requestGame(gameName) {
    const url = API_ROOT + '/games/' + gameName + '/data/'
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Requests a list of all available GameTags.
 *
 * @throws Error when the request is rejected.
 */
export async function requestGameTags() {
    const url = API_ROOT + '/tags/';
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Requests a sorted list of games.
 *
 * @param query instance of Reacts URLSearchParams, which you should get from useSearchParams()
 */
export async function requestGamesSorted(query) {
    const url = API_ROOT + '/get_games/' + query;
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Posts a Score table row for a specific game.
 * Example scoreData: {"player":7,"Points":355,"Time":120}
 * for a Game with Points and Time Score headers.
 *
 * @param {string} gameName - name of the game.
 * @param {{}} scoreData - scores to upload to the server. Also needs to have a player field
 *
 * @throws Error when the request is rejected or when the user is not logged in.
 */
export async function postGameScore(gameName, scoreData) {
    const url = API_ROOT + '/games/' + gameName + '/add_score/'
    // checking if the user is logged in
    if (!is_logged_in()) {
        let e = new Error('User credentials not found (user not logged in)!')
        console.log(e)
        throw e;
    }
    const req = {
        data: scoreData
    }
    const opt = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${get_user().token}`,
        },
    }
    try {
        console.log(opt)
        return await axios.post(url, req, opt)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Gets the current user associate with this session. Returns null if user is not logged in.
 *
 * @return {{token, name, email} | null} user object {token, name, email} or null
 */
export function get_user() {
    let user_str = localStorage.getItem("user");
    if (!user_str) {
        return null;
    }
    return JSON.parse(user_str);
}

/**
 * Returns true if the user is logged in.
 */
export function is_logged_in() {
    return get_user() != null
}

/**
 * Returns true if the user is an admin.
 */
export function is_admin() {
    let user = localStorage.getItem('user');
    if (user) {
        return user.is_admin;
    }
    return null
}

/**
 * Checks if a password is valid.
 *
 * @param {string} password - the password in plaintext
 */
function passwordValidator(password) {
    // Todo: make this more thorough.
    return password.length >= 8;
}

/**
 * Signs up a new User, with a new password.
 *
 * @param {string} userName - name of the user
 * @param {string} email - email address of the user
 * @param {string} password - the password in plaintext
 *
 * @throws Error when the request is rejected. This can happen if the username
 *               is taken or invalid, or if the password is invalid.
 */
export async function signupNewUser(userName, email, password) {
    const url = API_ROOT + '/sign_up/';

    // validating the password on client side:
    // Note: this doesn't mean that the password is not also going to be checked server side.
    if (!passwordValidator(password))
        throw new Error('Password is not valid!')

    // sending the request:
    let data = {
        'username': userName,
        'email': email,
        'password': password,
    }
    try {
        return await axios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Sends a login requests. The user data associated is stored on local storage, and it can be acquired
 * by doing `localStorage.getItem("user")`.
 *
 * @param {string} userName - name of the user
 * @param {string} email - email address of the user
 * @param {string} password - the password in plaintext
 *
 * @throws Error login error
 */
export async function login(userName, email, password) {
    const url = API_ROOT + '/login/';
    // sending the request:
    let data = {
        'username': userName,
        'email': email,
        'password': password,
    }
    try {
        let response = await axios.post(url, data);
        let user_data = {
            token: response.data.token,
            name: userName,
            email: email,
            is_admin: response.data.is_admin === true
        };
        console.log(user_data);
        localStorage.setItem("user", JSON.stringify(user_data));
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Logs out the current user by deleting the auth_token.
 */
export function logout() {
    localStorage.removeItem("user");
}
