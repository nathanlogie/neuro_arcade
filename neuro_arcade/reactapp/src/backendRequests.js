import axios from "axios";

const API_ROOT = "http://localhost:8000"
/**
 * This file contains functions that request or upload data from/to the backend
 */

// Typedefs need syncing with django serialisers

/**
 * Score type header API response
 * Corresponds to an entry of na.models.Game.score_type
 * @typedef {Object} ScoreTypeHeader
 * @property {string} name
 * @property {string} description
 * @property {string} [min]
 * @property {string} [max]
 */

/**
 * Score type API response
 * Corresponds to na.models.Game.score_type
 * @typedef {Object} ScoreType
 * @property {ScoreTypeHeader[]} headers
 */

/**
 * Game API response
 * Corresponds to na.models.Game
 * @typedef {Object} Game
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string[]} tags - slugs of the tags for this game
 * @property {ScoreType} score_type
 * @property {string} play_link
 */

/**
 * Game tag API response
 * Corresponds to na.models.GameTag
 * @typedef {Object} GameTag
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 */

/**
 * About page data publication API input/response
 * Corresponds to the publications field of about.json
 * @typedef {Object} AboutDataPublication
 * @property {string} title
 * @property {string} author
 * @property {string} link
 */

/**
 * About page data API response
 * Corresponds to the about.json file
 * @typedef {Object} AboutData
 * @property {string} description
 * @property {AboutDataPublication[]} publications
 */

/**
 * Requests the data associated with a game.
 *
 * @param {string} gameName - slug of the game name
 *
 * @return {Game} response data
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
 * @return {GameTag[]} response data
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
 * @param query {URLSearchParams} instance of Reacts URLSearchParams, which you should get from useSearchParams()
 *
 * @return {Game[]} response data
 *
 * @throws Error when request is rejected
 */
export async function requestGamesSorted(query='') {
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
 * @param {{}} scoreData - scores to upload to the server. Also needs to have a player field (TODO: type hint)
 *
 * @throws Error when the request is rejected.
 */
export function postGameScore(gameName, scoreData) {
    //todo get this working with get_current_user()
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
 * Requests about data
 *
 * @throws err when get is rejected
 *
 * @returns {AboutData} response if successful
 */
export async function getAboutData(){

    try {
        let response = await axios.get(API_ROOT + '/about/')
        return response.data
    }
    catch (err){
        console.log("ERROR WHILE FETCHING ABOUT DATA: " + err)
        throw err
    }

}

/**
 * Posts description to json file
 *
 * @param {string} description - description to post
 *
 * @throws error when post is rejected
 *
 * @returns {Object} response when post is accepted
 */
export function postDescription(description){
    const url = API_ROOT + '/edit_about'

    axios.post(url, {value: description, field: "description"})
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error("ERROR OCCURRED DURING DESCRIPTION POST:\n" + error);
            throw(error)
        });

}

/**
 * Posts publications to json file
 *
 * @param {AboutDataPublication[]} publications - publications for about data
 *
 * @throws error when post is rejected
 *
 * @return {Object} response if successful
 */
export async function postPublications(publications){
    const url = API_ROOT + '/edit_about'

    try {
        const response = await axios.post(url, { value: publications, field: "publications" });
        return response.data;
    }
    catch(error){
        console.error("ERROR OCCURRED DURING PUBLICATIONS POST:\n" + error);
        throw(error)
    }
}

/**
 * Gets the current user associate with this session. Returns null if user is not logged in.
 *
 * @return {{} | null} user object {token, name, email} or null
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
 *
 * @return {boolean} true if valid
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
 *
 * @return {Object} response if successful
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
 *
 * @return {Object} resposne if successful
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
    localStorage.removeItem("user");
}
