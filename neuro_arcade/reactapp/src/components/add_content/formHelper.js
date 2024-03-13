export const IMAGE_EXTENSION = ["png", "jpg", "jpeg"];
export const EVAL_EXTENSION = ["py"];
export const SCORE_EXTENSION = ["json"];
export const MAX_NAME_LENGTH_GAME = 64;
export const MAX_DESCRIPTION_LENGTH_GAME = 1024;

export const MAX_NAME_LENGTH_MODEL = 64;

export const MAX_DESCRIPTION_LENGTH_MODEL = 1024;

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
