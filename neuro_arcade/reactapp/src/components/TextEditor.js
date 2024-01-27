import {Editor} from "primereact/editor";
import { useFormik } from 'formik';
import aboutJsonData from "../static/about.json";
import { useState } from 'react';


const TextEditor = ({f}) => {

    //todo pass text into saveinput correctly
    const saveInput = () => {
        f.values.description = this.value;
    }

    return (
        <div>
            <Editor
                name="description"
                value={f.values.description}
                onTextChange={ saveInput }
                style={{ height: '320px' }}
            />
        </div>
    )
}

export default TextEditor;