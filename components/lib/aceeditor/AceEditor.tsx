import React from "react";

import AceEditor from "react-ace";
import { QueryAutoCompleter } from "mongodb-ace-autocompleter";
import "mongodb-ace-theme";
import "mongodb-ace-mode";

import "ace-builds/src-noconflict/mode-javascript";
import tools from "ace-builds/src-noconflict/ext-language_tools";

const textCompleter = tools.textCompleter;

// For auto-completion of queries, pass the server version,
// the text completer, and the processed schema fields
const queryAutoCompleter = new QueryAutoCompleter("3.6.0", textCompleter, [
  {
    name: "_id",
    value: "_id",
    score: 1,
    meta: "field",
    version: "0.0.0",
  },
  {
    name: "name",
    value: "name",
    score: 1,
    meta: "field",
    version: "0.0.0",
  },
]);
tools.setCompleters([queryAutoCompleter]);

export function AceEditorComponent(props) {
  return (
    <AceEditor
      mode={"mongodb"}
      theme={"mongodb"}
      name={"asdasdasdadad"}
      placeholder={"{}"}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
      }}
    />
  );
}
