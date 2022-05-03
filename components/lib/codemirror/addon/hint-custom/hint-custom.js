const CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/hint/javascript-hint');
const fuzzaldrin = require('fuzzaldrin-plus');

CodeMirror.hint.javascript = function (editor) {
    const opts = editor.getOption('mongodbFields');
    var list = opts;
    var cursor = editor.getCursor();
    var currentLine = editor.getLine(cursor.line);
    var start = cursor.ch;
    var end = start;
    while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end))) ++end;
    while (start && /[\w$]+/.test(currentLine.charAt(start - 1))) --start;
    var curWord = start != end && currentLine.slice(start, end);
    var result = {
        list: (!curWord ? list : fuzzaldrin.filter(list, curWord, {})),
        from: CodeMirror.Pos(cursor.line, start),
        to: CodeMirror.Pos(cursor.line, end)
    };

    return result;
};
