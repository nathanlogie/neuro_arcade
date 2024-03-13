export const IMAGE_EXTENSION = ["png", "jpg", "jpeg"];
export const EVAL_EXTENSION = ["py"];
export const SCORE_EXTENSION = ["json"];
export const MAX_NAME_LENGTH_GAME = 64;
export const MAX_DESCRIPTION_LENGTH_GAME = 1024;

export const MAX_NAME_LENGTH_MODEL = 64;

export const MAX_DESCRIPTION_LENGTH_MODEL = 1024;


export const customStyles = {
    option: (provided) => ({...provided, color: "white"}),
    control: (provided) => ({
        ...provided,
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        border: "none",
        borderRadius: "0.5em"
    }),
    valueContainer: (provided) => ({...provided, height: "max-content"}),
    placeholder: (provided) => ({
        ...provided,
        color: "#CCCCCC",
        textAlign: "left",
        fontSize: "0.9em",
        paddingLeft: "1em"
    }),
    input: (provided) => ({...provided, color: "#FFFFFF", paddingLeft: "1em", fontSize: "0.9em"}),
    multiValue: (provided) => ({...provided, backgroundColor: "rgba(0,0,0,0.2)", color: "white", borderRadius: "0.5em"}),
    multiValueLabel: (provided) => ({...provided, color: "white"}),
    multiValueRemove: (provided) => ({...provided, borderRadius: "0.5em"}),
    menu: (provided) => ({...provided, borderRadius: "0.5em", position: "relative"})
};

// Used for handling file uploads in the Forms
export function handleFileUpload(file, allowedExtensions, fileSetter, errorSetter, errorLocation) {
     const fileExtension = file.name.split(".").pop().toLowerCase();
     if (allowedExtensions.includes(fileExtension)) {
         fileSetter(file);
     } else {
         // file doesn't include an accepted image file extension, so it's refused
         errorSetter(errorLocation, {message: "Invalid file type provided"});
         fileSetter(null);
     }
}
