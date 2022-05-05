import React from "react";

import { AceEditorComponent } from "../components/lib/aceeditor/AceEditor";

export default {
  title: "PrimeReact/AceEditor",
  component: AceEditorComponent,
  argTypes: {},
};

const Template = (args) => {
  return (
      <AceEditorComponent />
  );
};

/**
 * Basic
 */
export const Basic = Template.bind({});
Basic.args = {

};
