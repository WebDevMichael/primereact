import React from "react";

import { CodeMirrorComponent } from "../components/lib/codemirror/CodeMirrorCustom";

export default {
  title: "PrimeReact/CodeMirrorCustom",
  component: CodeMirrorComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

const Template = (args) => {
  return (
      <CodeMirrorComponent {...args} />
  );
};

/**
 * Basic
 */
export const Basic = Template.bind({});
Basic.args = {
    onSubmit: () => {
        console.log('onSubmit triggered');
    }
};
