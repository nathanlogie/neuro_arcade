import axios from "axios";

const API_ROOT = "http://localhost:8000"

/**
 * This file contains functions that request or upload data from/to the backend
 */

/**
 * Error thrown when a request that requires authentication
 *  is called, but no user is currently logged in.
 */
class UserNotAuthenticatedError extends Error {
    constructor() {
        super("User not logged in!");
        this.name = "UserNotAuthenticatedError";
    }
}

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
 * @throws Error when the request is rejected.
 */
export async function requestGameTags() {
    const url = API_ROOT + '/tags/';
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
 * @param query instance of Reacts URLSearchParams, which you should get from useSearchParams()
 */
export async function requestGamesSorted(query='') {
    const url = API_ROOT + '/get_games/' + query;
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

    if (!is_logged_in())
        throw UserNotAuthenticatedError()

    return await axios.post(url, {
        playerName: playerName,
        isAI: isAI,
    }, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${get_user().token}`,
        },
    }).then((response) => {
        console.log('Creation of player ' + playerName + ' successful!');
        return response;
    }).catch((error) => {
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

    if (!is_logged_in())
        throw UserNotAuthenticatedError()

    return await axios.post(url, {
        playerName: playerName,
    }, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${get_user().token}`,
        },
    }).then((response) => {
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
    if (!is_logged_in())
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
            'Authorization': `Token ${get_user().token}`,
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
 * Gets the current user associate with this session. Returns null if user is not logged in.
 *
 * @return {{token, name, email, is_admin} | null} user object {token, name, email, is_admin} or null
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
 * Returns true if the user is an admin and false if the user is not.
 * Returns null if the user is not logged in.
 */
export function userIsAdmin() {
    let user = localStorage.getItem('user');
    if (user) {
        return user.is_admin;
    }
    return null;
}

/**
 * Requests about data
 *
 * @throws err when get is rejected
 *
 * @returns response if successful
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
 * @Param description - description to post
 *
 * @throws error when post is rejected
 *
 * @returns response when post is accepted
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
 * @Param publications - publications for about data
 *
 * @throws error when post is rejected
 *
 * @return response if successful
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
 * @throws Error when the request is rejected.
 *  If the email or username was already taken the status will be 409.
 *  An error can also be thrown if the password is invalid.
 */
export async function signupNewUser(userName, email, password) {
    const url = API_ROOT + '/sign_up/';

    // validating the password on client side:
    // Note: this doesn't mean that the password is not also going to be checked server side.
    if (!passwordValidator(password))
        throw new Error('Password is not valid!')

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
    return await axios.post(url, {
        'username': userName,
        'email': email,
        'password': password,
    }).then((response) => {
        let user_data = {
            token: response.data.token,
            name: userName,
            email: email,
            is_admin: response.data.is_admin === true
        };
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

export async function postGame(data) {
    const url = API_ROOT + '/games' + '/data/'
    return await axios.post(url, data)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        });
}
