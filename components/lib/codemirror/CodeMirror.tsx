import React, { useState } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";

export function CodeMirrorComponent(props){
    const [codeMirrorFieldState, setCodeMirrorFieldState] = useState('{}');
    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (event.metaKey && event.key === "Enter" && props.onSubmit) {
            props.onSubmit();
        }
    };
    const options = {
        autoCloseBrackets: true,
        indentWithTabs: true,
        lineNumbers: true,
        // lineWrapping: true,
        matchBrackets: true,
        mode: "javascript",
        smartIndent: true,
        tabSize: 2,
        theme: "material",
        value: "{}",
        extraKeys: {
            "Ctrl-Space": "autocomplete",
        },
        hintOptions: {
            hint: () => {
                console.log("hintttt");
                return { hint: {} };
            },
        },
        mongodb: {
            fields: {
                _id: "ObjectId",
                name: "String",
                age: "Number",
                number_of_pets: "Number",
                addresses: "Array",
                "addresses.street": "String",
            },
        },
    };


    return (<CodeMirror
        value={codeMirrorFieldState}
        options={options}
        onBeforeChange={(_editor, _data, value) => {
            setCodeMirrorFieldState(value);
        }}
        onKeyDown={(editor, event) => onKeyDown(event)}
    />)
}
