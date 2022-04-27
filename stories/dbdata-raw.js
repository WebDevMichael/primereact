import { ObjectId } from "bson";

const bson = [{
    "_id": new ObjectId("61f2e0fe799c513668bcfeb3"),
    "now": new Date(),
    "name": "Falcon",
    "created": new Date("2022-01-27T19:15:08.199+0100"),
    "launched": true,
    "someArray": [
        -1.11,
        {
            "project": new ObjectId("6202e8163cd35d5398f8aa7c")
        },
        3.0
    ],
    "someNullField": null,
    "someObjectField": {
        "str": "sdif",
        "bool": false,
        "arr": [],
        "date": new Date("2022-02-07T10:35:59.073+0100")
    },
    "double": 3.14
},
    {
        "_id": new ObjectId("6263cde66482bc292e601fa3"),
        "name": "Apollo",
        "created": new Date("2022-02-01T00:00:08.199+0100"),
        "launched": false,
        "someArray": [
            -1.11,
            {
                "project": new ObjectId("6202e8163cd35d5398f8aa7c")
            },
            3.0
        ],
        "someNullField": null,
        "someObjectField": {
            "str": "sdif",
            "bool": false,
            "arr": [],
            "date": new Date("2022-02-07T10:35:59.073+0100")
        },
        "double": 3.14
    }
];
export default bson
