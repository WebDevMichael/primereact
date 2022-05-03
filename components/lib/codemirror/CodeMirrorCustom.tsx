import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import beautify from 'js-beautify'
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "./addon/hint-custom/hint-custom";

import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/theme/material.css";

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
        lineWrapping: true,
        matchBrackets: true,
        mode: {name: "javascript", json: true},
        smartIndent: true,
        tabSize: 2,
        theme: "material",
        value: "{}",
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-L": () => {
                setCodeMirrorFieldState(beautify(codeMirrorFieldState, { indent_size: 2 }))
            }
        },
        mongodbFields: [
            '_id', 'hasLaunched', 'hasNotLaunched', 'rocketId',
            '$exists', '$size', 'true', 'false', '$ne', '$in',
            'ObjectId'
        ]
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
