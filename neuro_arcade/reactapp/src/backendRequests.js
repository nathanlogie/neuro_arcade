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
 * Game auto primary key
 * @typedef {number} GameKey
 */

/**
 * GameTag auto primary key
 * @typedef {number} GameTagKey
 */

/**
 * Game API response
 * Corresponds to na.models.Game
 * @typedef {Object} Game
 * @property {GameKey} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {any} owner - TODO
 * @property {any} icon - TODO
 * @property {GameTagKey[]} tags
 * @property {ScoreType} score_type
 * @property {string} play_link
 * @property {any} evaluation_script
 */

/**
 * Game tag API response
 * Corresponds to na.models.GameTag
 * @typedef {Object} GameTag
 * @property {GameTagKey} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 */

/**
 * PlayerTag auto primary key
 * @typedef {number} PlayerTagKey
 */

/**
 * PlayerTag API response
 * Corresponds to na.models.PlayerTag
 * @typedef {Object} PlayerTag
 * @property {PlayerTagKey} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 */

/**
 * Player auto primary key
 * @typedef {number} PlayerKey
 */

/**
 * Player API response
 * Corresponds to na.models.Player
 * @typedef {Object} Player
 * @property {PlayerKey} id
 * @property {string} name
 * @property {string} slug
 * @property {boolean} is_ai
 * @property {string} user
 * @property {string} description
 * @property {PlayerTagKey[]} tags
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
    const url = API_ROOT + '/api/gameTag/';
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
 * @return {Game[]} response data
 * 
 * @throws Error when request is rejected
 */
export async function requestGames() {
    const url = API_ROOT + '/api/games/';
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Requests a list of players.
 *
 * @return {Player[]} response data
 * 
 * @throws Error when request is rejected
 */
export async function requestPlayers() {
    const url = API_ROOT + '/api/players/';
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
 * Checks if a password is valid.
 * Todo: make this more thorough.
 *
 * @param {string} password - the password in plaintext
 * 
 * @return {boolean} true if valid
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
