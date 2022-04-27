import TreeNode from "../treenode";
import { isArray, isBoolean, isDate, isNull, isNumber, isObject, isString } from "lodash";
import { EJSON } from "bson";

export type MongoResultDocument = { [p: string]: any; _id: string };

enum MONGO_VALUE_TYPE {
  DATE = "Date",
  OBJECTID = "ObjectId",
  STRING = "String",
  BOOLEAN = "Boolean",
  ARRAY = "Array",
  NULL = "Null",
  OBJECT = "Object",
  NUMBER = "Number",
  DOUBLE = "Double",
}

type MongoRow = MongoResultDocument;

export function isObjectId(value: unknown) {
  const objectIdRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])([a-z0-9]+)$/);
  return objectIdRegex.test(value + "");
}

export function getValueType(
  docValue: Date | string | number | Array<unknown> | Record<string, unknown> | boolean | unknown
): MONGO_VALUE_TYPE {
  if (isDate(docValue)) {
    return MONGO_VALUE_TYPE.DATE;
  } else if (isObjectId(docValue + "")) {
    return MONGO_VALUE_TYPE.OBJECTID;
  } else if (isString(docValue)) {
    return MONGO_VALUE_TYPE.STRING;
  } else if (isBoolean(docValue)) {
    return MONGO_VALUE_TYPE.BOOLEAN;
  } else if (isArray(docValue)) {
    return MONGO_VALUE_TYPE.ARRAY;
  } else if (isNull(docValue)) {
    return MONGO_VALUE_TYPE.NULL;
  } else if (isObject(docValue)) {
    return MONGO_VALUE_TYPE.OBJECT;
  } else if (isNumber(docValue)) {
    if (Number.isInteger(docValue)) {
      return MONGO_VALUE_TYPE.NUMBER;
    }
    return MONGO_VALUE_TYPE.DOUBLE;
  } else {
    console.warn("Type not found");
    throw Error(`Type not found for value: ${docValue}`);
  }
}

function getMongoRowValue(mongoFieldValue: any, type: MONGO_VALUE_TYPE) {
  if (type === MONGO_VALUE_TYPE.OBJECT) {
    return `{ ${Object.keys(mongoFieldValue).length} fields }`;
  }
  if (type === MONGO_VALUE_TYPE.ARRAY && isArray(mongoFieldValue)) {
    return `[ ${mongoFieldValue.length} elements ]`;
  }
  return mongoFieldValue + "";
}

function getChildren(
  mongoQueryResultDocument: Array<unknown> | Record<string, unknown>,
  level = 1
): TreeNode["children"] {
  if (isArray(mongoQueryResultDocument)) {
    // @ts-ignore
    const subRows = mongoQueryResultDocument.reduce<TreeNode[]>((acc2, mongoRowField: string, index) => {
      const mongoFieldValue: unknown = mongoQueryResultDocument[index];
      const valueType = getValueType(mongoFieldValue);
      const newSubRow: TreeNode = {
        key: `${index}`,
        data: {
          key: `${index}`,
          value: getMongoRowValue(mongoFieldValue, valueType),
          type: valueType,
          realData: mongoFieldValue,
        },
      };
      if (valueType === MONGO_VALUE_TYPE.OBJECT && isObject(mongoFieldValue)) {
        newSubRow.children = getChildren(mongoFieldValue as Record<string, unknown>, level++);
      }
      if (valueType === MONGO_VALUE_TYPE.ARRAY && isArray(mongoFieldValue)) {
        // @ts-ignore
        newSubRow.children = getChildren(mongoFieldValue, level++);
      }
      acc2.push(newSubRow);
      return acc2;
    }, []);
    return subRows;
  } else if (isObject(mongoQueryResultDocument)) {
    const subRows = Object.keys(mongoQueryResultDocument).reduce<TreeNode[]>((acc2, key: string) => {
      const mongoFieldValue = mongoQueryResultDocument[key];
      const valueType = getValueType(mongoFieldValue);
      const newSubRow: TreeNode = {
        key: `${level}_${key}`,
        data: {
          key,
          value: getMongoRowValue(mongoFieldValue, valueType),
          type: valueType,
          realData: mongoFieldValue,
        },
      };
      if (valueType === MONGO_VALUE_TYPE.OBJECT && isObject(mongoFieldValue)) {
        newSubRow.children = getChildren(mongoFieldValue as Record<string, unknown>, level++);
      }
      if (valueType === MONGO_VALUE_TYPE.ARRAY && isArray(mongoFieldValue)) {
        newSubRow.children = getChildren(mongoFieldValue, level++);
      }
      acc2.push(newSubRow);
      return acc2;
    }, []);

    return subRows;
  } else {
    throw new Error("Mongo value not accepted for sub rows in table");
  }
}

export function mongoDataConverter(mongoResult: MongoResultDocument[]): TreeNode[] {
  const output = mongoResult.reduce<TreeNode[]>((acc, mongoQueryResultDocument: MongoRow, index) => {
    acc.push({
      key: `${mongoQueryResultDocument._id.toString()}`,
      data: {
        key: `(${index + 1}) { _id: ${mongoQueryResultDocument._id.toString()} }`,
        value: `{ ${Object.keys(mongoQueryResultDocument).length} fields }`,
        type: "Document",
        realData: EJSON.serialize(mongoQueryResultDocument),
      },
      children: getChildren(mongoQueryResultDocument),
    });
    return acc;
  }, []);
  return output;
}
