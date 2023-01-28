import React from "react";

import "../components/themes/nova/theme.css";
import "../components/styles/primereact.css";
import "primeicons/primeicons.css";

import "../components/lib/treetable/TreeTable.css";
import { Column, TreeTable } from "../components";
import type { TreeTableEventParams, TreeTableProps } from "../components/lib/treetable/TreeTable";
import type TreeNode from "../components/lib/treenode/TreeNode";
import dbDataRockets1 from "./dbdata-rockets-1.json";
import dbDataRaw from "./dbdata-raw.js";
import { EJSON } from "bson";

const nodes: TreeNode[] = dbDataRockets1;

export default {
  title: "PrimeReact/TreeTable",
  component: TreeTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

const Template = (args: Partial<TreeTableProps>) => {
  return (
    <>
      <TreeTable mongoDbData={args.mongoDbData} value={args.value} onKeyDown={args.onKeyDown}>
        <Column field="key" header="Key" expander />
        <Column field="value" header="Value" />
        <Column field="type" header="Type" />
      </TreeTable>
    </>
  );
};

/**
 * BSON
 */
export const BSON = Template.bind({});
BSON.args = {
  mongoDbData: EJSON.serialize(dbDataRaw),
};

/**
 * JSONData
 */
export const JSONData = Template.bind({});
JSONData.args = {
  value: nodes,
};

const MyTestTitle = () => (
  <div>
    Michael{" "}
    <a className={"pi pi-pencil"} onClick={() => console.log("test interaction")}>
      click me
    </a>
  </div>
);
/**
 * Menu list
 */
const menuList: TreeNode[] = [
  {
    key: "key1",
    data: {
      title: <MyTestTitle />,
      type: "",
    },
    children: [
      {
        key: "key2_1",
        data: {
          title: "rockets",
          type: "",
        },
        children: [
          {
            key: "key3",
            data: {
              title: "_id",
              type: "ObjectId",
            },
          },
        ],
      },
    ],
  },
];
const testOnRowDoubleClick = (e: TreeTableEventParams, node: TreeNode) => {
  console.log("====== e", e);
  console.log("====== node", node);
};

export const TreeTableMenuList = () => (
  <TreeTable value={menuList} onRowDoubleClick={testOnRowDoubleClick}>
    <Column field="title" header="Databases" expander />
    <Column field="type" header="" />
  </TreeTable>
);
TreeTableMenuList.args = {
  value: menuList,
};
