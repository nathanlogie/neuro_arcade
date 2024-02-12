/**
 * Prototype for RadioList.onChange callback
 * 
 * @typedef {function} OnRadioChange
 * @param {number} index - index of the option chosen
 */

/**
 * Component to render a list of radio buttons
 * @param {Object} props
 * @param {string} props.name - html name for the inputs
 * @param {string[]} props.options - list of option names
 * @param {OnRadioChange} props.onChange - callback for when an option is selected
 * @returns {JSX.Element} radio list
 */
export function RadioList({name, options, onChange}) {
    return (
        <>
            {options.map((option, index) => {
                return <label key={index}>
                    <input
                        id={'radio_' + name + '_' + option}
                        name={name}
                        type='radio'
                        onChange={() => onChange(index)}
                        defaultChecked={index == 0}
                    />
                    <label htmlFor={'radio_' + name + '_' + option}>
                        {option}
                    </label>
                </label>
            })}
        </>
    );
}
