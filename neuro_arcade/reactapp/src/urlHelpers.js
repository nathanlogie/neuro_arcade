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
 * @param {Object} [options] - same as https://reactrouter.com/en/main/hooks/use-navigate
 * @param {Decoder} [decoder] - function to convert data from string to desired form
 * @returns {[any, SetSearchParam]}
 */
export function useSearchParam(name, defaultVal, options=null, decoder=null) {
    let [searchParams, setSearchParams] = useSearchParams();

    let value = searchParams.get(name);
    if (value === null)
        value = defaultVal;
    else if (decoder)
        value = decoder(value);

    function setter(val) {
        console.log("setter", val);
        setSearchParams(
            (params) => {
                if (val === defaultVal)
                    params.delete(name)
                else
                    params.set(name, val);
                return params;
            },
            options,
        );
    };

    return [value, setter];
}

/**
 * Variant of useSearchParam using getAll to allow for array types
 * Default value is the empty array
 * 
 * @param {string} name - parameter name
 * @param {Object} [options] - same as https://reactrouter.com/en/main/hooks/use-navigate
 * @param {Decoder} [decoder] - function to convert each item of data from string to desired form
 * @returns {[any[], SetSearchParam]}
 */
export function useArraySearchParam(name, options=null, decoder=null) {
    let [searchParams, setSearchParams] = useSearchParams();

    let values = searchParams.getAll(name);
    if (decoder)
        values = values.map(decoder);

    function setter(val) {
        setSearchParams(
            (params) => {
                params.delete(name);
                val.map((v) => params.append(name, v));
                return params;
            },
            options,
        );
    };

    return [values, setter];
}
