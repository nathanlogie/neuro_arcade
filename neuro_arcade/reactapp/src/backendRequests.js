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
 * @throws Error when the request is rejected.
 */
export function postGameScore(gameName, scoreData) {
    const url = API_ROOT + '/games/' + gameName + '/data/'
    axios.post(url, scoreData)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        });
}

/**
 * Checks if a password is valid.
 * Todo: make this more thorough.
 *
 * @param {string} password - the password in plaintext
 */
function passwordValidator(password) {
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
        let response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Sends a login requests. The authentication token associated with the login is stored in sessionStorage.
 * To get it do `sessionStorage.getItem("auth_token")`
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
        // TODO: is it right to use sessionStorage here or would LocalStorage be better?
        sessionStorage.setItem("auth_token", response.data.token);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Logs out the current user by deleting the auth_token.
 */
export function logout() {
    sessionStorage.removeItem("auth_token");
}
