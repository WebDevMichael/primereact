import React, { useRef } from "react";

import "../public/themes/nova/theme.css";
import "../styles/primereact.css";
import "primeicons/primeicons.css";

import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/theme/material.css";

import { CodeMirrorComponent } from "../components/lib/codemirror/CodeMirror";

export default {
  title: "PrimeReact/CodeMirror",
  component: CodeMirrorComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

const Template = (args) => {
  const menuRef = useRef(null);
  return (
      <CodeMirrorComponent {...args} ref={menuRef} />
  );
};

/**
 * Basic
 */
export const Basic = Template.bind({});
Basic.args = {

};
