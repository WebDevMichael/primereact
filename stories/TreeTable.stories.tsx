import React from 'react';

import "../public/themes/nova/theme.css";
import "../styles/primereact.css";
import "primeicons/primeicons.css";

import '../components/lib/treetable/TreeTable.css';
import { TreeTable } from '../components/lib/treetable/TreeTable';
import TreeNode from '../components/lib/treenode/TreeNode';
import { Column } from '../components/lib/column/Column';

const nodes: TreeNode[] = [
    {
        key: "61f2e0fe799c513668bcfeb3",
        data: {
            key: "(1) { _id: 61f2e0fe799c513668bcfeb3 }",
            value: "{ 8 fields }",
            type: "Document"
        },
        children: [
            {
                key: "1__id",
                data: {
                    key: "_id",
                    value: "61f2e0fe799c513668bcfeb3",
                    type: "ObjectId"
                }
            },
            {
                key: "1_name",
                data: {
                    key: "name",
                    value: "Falcon",
                    type: "String"
                }
            },
            {
                key: "1_created",
                data: {
                    key: "created",
                    value: "Thu Jan 27 2022 19:15:08 GMT+0100 (Central European Standard Time)",
                    type: "Date"
                }
            },
            {
                key: "1_launched",
                data: {
                    key: "launched",
                    value: "true",
                    type: "Boolean"
                }
            },
            {
                key: "1_someArray",
                data: {
                    key: "someArray",
                    value: "[ 3 elements ]",
                    type: "Array"
                },
                children: [
                    {
                        key: "0",
                        data: {
                            key: "0",
                            value: "-1.11",
                            type: "Double"
                        }
                    },
                    {
                        key: "1",
                        data: {
                            key: "1",
                            value: "{ 1 fields }",
                            type: "Object"
                        },
                        children: [
                            {
                                key: "1_project",
                                data: {
                                    key: "project",
                                    value: "6202e8163cd35d5398f8aa7c",
                                    type: "ObjectId"
                                }
                            }
                        ]
                    },
                    {
                        key: "2",
                        data: {
                            key: "2",
                            value: "3",
                            type: "Number"
                        }
                    }
                ]
            },
            {
                key: "2_someNullField",
                data: {
                    key: "someNullField",
                    value: "null",
                    type: "Null"
                }
            },
            {
                key: "2_someObjectField",
                data: {
                    key: "someObjectField",
                    value: "{ 4 fields }",
                    type: "Object"
                },
                children: [
                    {
                        key: "2_str",
                        data: {
                            key: "str",
                            value: "sdif",
                            type: "String"
                        }
                    },
                    {
                        key: "2_bool",
                        data: {
                            key: "bool",
                            value: "false",
                            type: "Boolean"
                        }
                    },
                    {
                        key: "2_arr",
                        data: {
                            key: "arr",
                            value: "[ 0 elements ]",
                            type: "Array"
                        },
                        children: []
                    },
                    {
                        key: "3_date",
                        data: {
                            key: "date",
                            value: "Mon Feb 07 2022 10:35:59 GMT+0100 (Central European Standard Time)",
                            type: "Date"
                        }
                    }
                ]
            },
            {
                key: "3_double",
                data: {
                    key: "double",
                    value: "3.14",
                    type: "Double"
                }
            }
        ]
    }
];

export default {
    title: 'PrimeReact/TreeTable',
    component: TreeTable,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
};

export const Primary = () => (<TreeTable value={nodes} >
    <Column field="key" header="Key" expander />
    <Column field="value" header="Value" />
    <Column field="type" header="Type" />
</TreeTable>);
