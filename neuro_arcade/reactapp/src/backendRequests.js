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
 * @param gameName - name of the game.
 * @param scoreData - scores to upload to the server. Also needs to have a player field
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
export function postPublications(publications){
    const url = API_ROOT + '/edit_about'

    axios.post(url, {value: publications, field: "publications"})
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.error("ERROR OCCURRED DURING PUBLICATIONS POST:\n" + error);
            throw(error)
        });
}

/**
 * Posts Image to json file (for about page data)
 *
 * @Param imageURL - url of uploaded image
 *
 * @throws error when post is rejected
 *
 * @return response if successful
 */
export function postImage(imageURL) {
    const url = API_ROOT + '/edit_about'

    axios.post(url, { value: imageURL, field: "image"})
        .then(function(response){
            return response.data
        })
        .catch(function(error){
            console.error("ERROR OCCURRED DURING IMAGE POST:\n" + error)
            throw error
        })
}