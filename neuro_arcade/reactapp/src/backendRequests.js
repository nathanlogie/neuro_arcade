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
 * Ranked AI player API response
 * Corresponds to an entry in the /model_rankings/ endpoint
 * @typedef {Object} RankedModel
 * @property {Player} player - The player data of the model with this rank
 * @property {number} overall_score - Score of the model across games
 */

/**
 * Error thrown when a request that requires authentication
 *  is called, but no user is currently logged in.
 */
export class UserNotAuthenticatedError extends Error {
    constructor() {
        super("User not logged in!");
        this.name = "UserNotAuthenticatedError";
    }
}

/**
 * CSRF token used for security things.
 *
 * Should only be accessed by the getCSRFToken() function.
 */
let _csrfToken = null;

/**
 * Gets you the CSRF, which is usually cached.
 * If not cached, it will make a request at <API_ROOT>/csrf/ to get it.
 */
async function getCSRFToken() {
    if (_csrfToken == null) {
        // token needs to be requested
        const url = API_ROOT + '/csrf/';
        await axios.get(url, {credentials: 'include'})
            .then((response) => {
                _csrfToken = response.data.csrfToken;
            })
    }
    return _csrfToken;
}

/**
 * Returns request headers that can be used for a request to the sever.
 * Set authenticated to true to send the authentication token as well.
 *
 * @param {string} method HTTP method (so like GET, POST etc.)
 * @param {boolean} authenticated
 *
 * @return Axios Request Config
 */
async function getHeaders(method, authenticated=false) {
    let config = {
        credentials: 'include',
        method: method,
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    if (authenticated) {
        config.headers.Authorization = `Token ${getUser().token}`;
    }
    if (method.toUpperCase() === 'POST') {
        config.headers['X-CSRFToken'] = await getCSRFToken();
    }
    return config;
}

/**
 * Pings the API. Should always return 200 OK, unless the POST headers are wrong.
 */
export async function ping() {
    const url = API_ROOT + '/ping/';
    return await axios.post(url, {}, await getHeaders('POST'));
}

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
    return await axios.get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
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
 * Requests a list of all available PlayerTags.
 *
 * @return {PlayerTag[]} response data
 *
 * @throws Error when the request is rejected.
 */
export async function requestPlayerTags() {
    const url = API_ROOT + '/api/playerTag/';
    return await axios.get(url)
        .then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
            throw error;
        })
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
    return await axios.get(url).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
        throw error;
    })
}

/**
 * Creates a new player associated with the current user.
 * Requires the user to be authenticated, will throw an error if not.
 *
 * @param {string} playerName
 * @param {boolean} isAI
 *
 * @throws {Error | UserNotAuthenticatedError}
 */
export async function createNewPlayer(playerName, isAI) {
    const url = API_ROOT + "/create_player/";

    if (!isLoggedIn())
        throw UserNotAuthenticatedError()

    return await axios.post(url,
        { playerName: playerName, isAI: isAI },
        await getHeaders('POST', true)
    ).then((response) => {
        console.log('Creation of player ' + playerName + ' successful!');
        return response;
    }).catch((error) => {
        console.log(error);
        throw error;
    })
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
 * Requests a sorted list of models by their overall rank.
 *
 * @return {RankedModel[]} - Models in descending order of overall score
 */
export async function requestModelsRanked() {
    const url = API_ROOT + '/model_rankings/';
    return await axios.get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
}

/**
 * Deletes a player associated with the logged-in user.
 * Requires the user to be authenticated, will throw an error if not.
 *
 * @param {string} playerName
 *
 * @throws {Error | UserNotAuthenticatedError}
 */
export async function deletePlayer(playerName) {
    const url = API_ROOT + "/delete_player/";

    if (!isLoggedIn())
        throw new UserNotAuthenticatedError()

    return await axios.post(url, { playerName: playerName }, await getHeaders('POST', true))
        .then((response) => {
        console.log('Deletion of player ' + playerName + ' successful!');
        return response;
    }).catch((error) => {
        console.log(error);
        throw error;
    })
}

/**
 * Posts a Score table row for a specific game.
 * Example scoreData: {"player":7,"Points":355,"Time":120}
 * for a Game with Points and Time Score headers.
 *
 * @param {string} gameName - name of the game.
 * @param {string | int} playerIdentification identifies the player; can either be their name or ID
 *  The player needs to be owned by the current user for the request to be successful.
 * @param {{}} scoreData - scores to upload to the server.
 *  For every score type header, the request needs to have a field called the same as the score header.
 *
 *  Example: for a score type with a two headers called 'Points' and 'Time'
 *   the request needs to be: {'Points': <value>, 'Time': <value>}
 *
 * @throws {Error | UserNotAuthenticatedError} when the request is rejected or when the user is not logged in.
 */
export async function postGameScore(gameName, playerIdentification, scoreData) {
    const url = API_ROOT + '/games/' + gameName + '/add_score/'
    // checking if the user is logged in
    if (!isLoggedIn())
        throw UserNotAuthenticatedError()
    // request data
    let data = scoreData;
    if (typeof playerIdentification === 'string' || playerIdentification instanceof String) {
        data.PlayerName = playerIdentification;
    } else if (Number.isInteger(playerIdentification)) {
        data.PlayerID = playerIdentification;
    } else {
        console.log(typeof playerIdentification)
        throw Error("playerIdentification needs to be either an int or a string!")
    }
    // sending the request:
    return await axios.post(url, data, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${getUser().token}`,
        },
    }).then((response) => {
        console.log("Sending of game scores successful!");
        return response;
    }).catch((error) => {
        console.log(error);
        throw error;
    })
}

/**
 * Requests about data
 *
 * @throws err when get is rejected
 *
 * @returns {Promise} response if successful
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
export async function postDescription(description){
    const url = API_ROOT + '/edit_about/'

    axios.post(url, {value: description, field: "description"}, await getHeaders('POST', true))
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
    const url = API_ROOT + '/edit_about/'

    try {
        const response = await axios.post(url, { value: publications, field: "publications" }, await getHeaders('POST', true));
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
 * @return {{token, name, email, is_admin, id} | null} user object {token, name, email, is_admin, id} or null
 */
export function getUser() {
    let user_str = localStorage.getItem("user");
    if (!user_str) {
        return null;
    }
    return JSON.parse(user_str);
}

/**
 * Gets all users
 * All regular users should have a status on sign up
 * But admins don't and hence will be marked as admin
 *
 * @return {Object} user array on success
 * @throws error otherwise
 */
export async function getAllUsers() {
    const url = API_ROOT + '/api/users/';
    return await axios.get(url).then((response) => {
        return(response.data.map(function(user) {
            let status = "";
            if (user.status) {
                status = user.status.status;
            }
            else{
                status = "Admin";
            }
            return ({
                username: user.username,
                email: user.email,
                status: status
            });
        }))
    }).catch((error) => {
        console.log(error);
        throw error;
    })
}

/**
 * change user status
 *
 * @param {String} user - username
 * @param {String} newStatus - status to update
 *
 * @return {Promise} promise if status was successfully updated
 *
 * @throws error otherwise
 */
export async function updateStatus(user, newStatus){
    const url = API_ROOT + '/update_status/';

    await axios.post(url, {user: user, status: newStatus})
        .then( function (response) {
                return response;
            }
        )
        .catch(function(error){
            console.log(error);
            throw error;
        })
}

/**
 * Returns true if the user is logged in.
 */
export function isLoggedIn() {
    return getUser() != null
}

/**
 * Returns true if the user is an admin and false if the user is not.
 * Returns null if the user is not logged in.
 */
export function userIsAdmin() {
    let user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).is_admin;
    }
    return null;
}

export function getUserStatus(){
    let user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user).status;
    }
    return null;
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
 * @return {Object} response if successful
 *
 * @throws Error when the request is rejected.
 *  If the email or username was already taken the status will be 409.
 *  An error can also be thrown if the password is invalid.
 */
export async function signupNewUser(userName, email, password) {
    const url = API_ROOT + '/sign_up/';
    const emailRegex = new RegExp('[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}');

    // validating the password on client side:
    // Note: this doesn't mean that the password is not also going to be checked server side.
    if (!passwordValidator(password))
        throw new Error('Invalid Password. Password must be at least 8 characters.')

    // the username should not pass a test for being an email address:
    if (emailRegex.test(userName))
        throw new Error('Username cannot be a valid email address!')

    // sending the request:
    return await axios.post(url, {
        'username': userName,
        'email': email,
        'password': password,
    }).then((response) => {
        console.log("Signup successful!");
        return response;
    }).catch((error) => {
        console.log(error);
        throw error;
    })
}

/**
 * Sends a login requests. The user data associated is stored on local storage, and it can be acquired
 * by doing `localStorage.getItem("user")`. Either the email or username need to be provided.
 *
 * @param {string} userID - either the username or email of the user
 * @param {string} password - the password in plaintext
 *
 * @throws Error login error or if neither email nor username wasn't provided
 *
 * @return {Promise} promise of response if successful
 */
export async function login(userID, password) {
    const url = API_ROOT + '/login/';
    const emailRegex = new RegExp('[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}');
    let data;

    if (emailRegex.test(userID)) {
        // userID is considered to be an email address
        data = {'email': userID, 'password': password};
    } else {
        // userID is considered to be a username
        data = {'username': userID, 'password': password};
    }

    // sending the request:
    return await axios.post(url, data, await getHeaders('POST'))
        .then((response) => {
            let user_data = {
                token: response.data.token,
                name: response.data.username,
                email: response.data.email,
                is_admin: response.data.is_admin === true,
                id: response.data.id,
                status: null
            };

            if (!user_data.is_admin){
                user_data.status = response.data.status;
            }
            else{
                user_data.status = "admin"
            }

            if (user_data.status === "blocked"){
                throw new Error("Your account has been blocked.")
            }

            localStorage.setItem("user", JSON.stringify(user_data));
            return response;
    }).catch((error) => {
        console.log(error);
        throw error;
    });
}

/**
 * Logs out the current user by deleting the auth_token.
 */
export function logout() {
    console.log("Logging out...");
    localStorage.removeItem("user");
}

/**
 * Requests the data associated with a player.
 *
 * @param {string} playerName - slug of the player name
 *
 * @return {Player} response data
 *
 * @throws Error when the request is rejected.
 */
export async function requestPlayer(playerName) {
    const url = API_ROOT + '/players/' + playerName + '/data/'
    return await axios.get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        })
}

/**
 * Posts Admin Ranking to model
 *
 * @Param {Integer} gameID: ID of game to be ranked
 * @Param {Float} ranking: ranking of new game
 *
 * @returns Response success response
 *
 * @throws error otherwise
 */
export async function postAdminRanking(gameID, ranking){
    const url = API_ROOT + `/api/games/${gameID}/update_ranking/`

    await axios.post(url, ranking*10, getHeaders('POST'))
        .then((response) => {
            return response;
    })
        .catch((error) => {
            console.log(error);
            throw error;
        })

}

