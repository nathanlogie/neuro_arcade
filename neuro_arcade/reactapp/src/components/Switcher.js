import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import styles from "../styles/App.module.css";

// TODO: this should really just be passed a list of names, the table data
// structure should be handled by the component using this

/**
 * @typedef {Object} TableHeader
 * @property {string} name
 */

/**
 * Prototype for Switcher.onSwitcherChange callback
 *
 * @typedef {function} OnSwitcherChange
 * @param {string} name the name switched to
 */

/**
 * Renders a tab switcher for a list of options
 * @param {Object} props
 * @param {Object} props.data
 * @param {TableHeader[]} props.data.table_headers list of option names
 * @param {OnSwitcherChange} onSwitcherChange callback for a tab being clicked
 * @returns {JSX.Element} switcher
 */
export function Switcher({data, onSwitcherChange, switcherDefault}) {
    const [alignment, setAlignment] = React.useState(switcherDefault);

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            onSwitcherChange(newAlignment);
        }
    };

    const checkifSelected = (alignment, name) => {
        if ((typeof name === "string" && alignment === name) || (typeof name === "object" && alignment.type === name.type)) {
            return true;
        }
    };

    return (
        <>
            <ToggleButtonGroup color='primary' value={alignment} exclusive onChange={handleAlignment} aria-label='Platform'>
                {data.table_headers.map((header, index) => (
                    <div key={index}>
                        <ToggleButton
                            value={header.name}
                            id={
                                styles[
                                    (() => {
                                        if (index === 0 && index === data.table_headers.length - 1) {
                                            return "single";
                                        } else if (index === 0) {
                                            return "start";
                                        } else if (index === data.table_headers.length - 1) {
                                            return "end";
                                        } else {
                                            return "";
                                        }
                                    })()
                                ]
                            }
                            style={{
                                borderColor: checkifSelected(alignment, header.name) ? "white" : "transparent",
                                borderWidth: "0.3em",
                                backdropFilter: "blur(40px)",
                                backgroundColor: checkifSelected(alignment, header.name)
                                    ? "rgba(255, 255, 255, 0.3)"
                                    : "rgba(143,143,143, 0.2)",
                                color: "#EEEEEE",
                                fontSize: "0.75em",
                                fontFamily: "inherit",
                                fontWeight: "700",
                                margin: 0
                            }}
                        >
                            {header.name}
                        </ToggleButton>
                    </div>
                ))}
            </ToggleButtonGroup>
        </>
    );
}
