declare module "mongodb-ace-autocompleter" {
  export class QueryAutoCompleter {
    constructor(
      a: string,
      b: unknown,
      c: Array<{
        name: string;
        value: string;
        score: number;
        meta: string;
        version: string;
      }>
    );
  }
}
