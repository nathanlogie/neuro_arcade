import {SetURLSearchParams, useSearchParams} from "react-router-dom"

/**
 * Setter for the value of a search param
 *
 * @typedef {Function} SetSearchParam
 * @param {any} value
 */

/**
 * Converter from raw search param string to a desired type
 *
 * @typedef {Function} Decoder
 * @param {any} value - string version of search param
 */

/**
 * Hook for reading & writing a single search parameter
 * Wraps react-router-dom's useSearchParams
 * 
 * @param {string} name - parameter name
 * @param {string} defaultVal - value to return if the parameter is unset
 * @param {Decoder} [decoder] - function to convert data from string to desired form
 * @returns {[any, SetSearchParam]}
 */
export function useSearchParam(name, defaultVal, decoder=null) {
    let [searchParams, setSearchParams] = useSearchParams();

    let value = searchParams.get(name);
    if (value === null)
        value = defaultVal;
    else if (decoder)
        value = decoder(value);

    function setter(val) {
        setSearchParams((params) => {
            params.set(name, val);
            return params;
        });
    };

    return [value, setter];
}

