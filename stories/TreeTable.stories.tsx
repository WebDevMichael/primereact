import React from 'react';

import "../public/themes/nova/theme.css";
import "../styles/primereact.css";
import "primeicons/primeicons.css";

import '../components/lib/treetable/TreeTable.css';
import { TreeTable } from '../components/lib/treetable/TreeTable';
import TreeNode from '../components/lib/treenode/TreeNode';
import { Column } from '../components/lib/column/Column';
import dbDataRockets1 from "./dbdata-rockets-1.json";

const nodes: TreeNode[] = dbDataRockets1;

export default {
    title: 'PrimeReact/TreeTable',
    component: TreeTable,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
};

const Template = (args) => {
    return (<TreeTable value={args.value} onKeyDown={args.onKeyDown}>
        <Column field="key" header="Key" expander />
        <Column field="value" header="Value" />
        <Column field="type" header="Type" />
    </TreeTable>);
}

export const Primary = Template.bind({});

Primary.args = {
    value: nodes,
    onKeyDown: (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        node: TreeNode
    ) => {
        if (event.metaKey && event.key==="c") {
            navigator.clipboard.writeText(node.data.value);
            console.log('Copied value to clipboard:', node.data.value);
        }
    }
}
