const fs = require('fs');
const zlib = require('node:zlib');

const makeDirectory = (path) =>
    new Promise((resolve) => {
        fs.mkdir(path, () => {
            return resolve();
        });
    });

const readFile = (path, type) =>
    new Promise((resolve, reject) => {
        fs.readFile(path, type, (err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });

const writeFile = (path, data) =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err, res) => {
            if (err) return reject(err);

            return resolve(res);
        });
    });

const writeOnSameLine = async (message, fn) => {
    process.stdout.write(`${message}\r`);
};

const encodeURIPath = (path) => {
    path = path.split('\\').join('/');
    return encodeURI(path);
};

/**
 * From
 * https://github.com/qjebbs/vscode-plantuml/blob/master/src/plantuml/renders/plantumlServer.ts
 *     
The MIT License (MIT) 

Copyright (c) 2016 jebbs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
 */
const urlTextFrom = (s) => {
    let opt = { level: 9 };
    let d = zlib.deflateRawSync(new Buffer.from(s), opt);
    let b = encode64(String.fromCharCode(...d.subarray(0)));
    return b;
    // from synchro.js
    /* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0.1
     * LastModified: Dec 25 1999
     */
    function encode64(data) {
        let r = '';
        for (let i = 0; i < data.length; i += 3) {
            if (i + 2 == data.length) {
                r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
            } else if (i + 1 == data.length) {
                r += append3bytes(data.charCodeAt(i), 0, 0);
            } else {
                r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
            }
        }
        return r;
    }

    function append3bytes(b1, b2, b3) {
        let c1 = b1 >> 2;
        let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        let c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
        let c4 = b3 & 0x3f;
        let r = '';
        r += encode6bit(c1 & 0x3f);
        r += encode6bit(c2 & 0x3f);
        r += encode6bit(c3 & 0x3f);
        r += encode6bit(c4 & 0x3f);
        return r;
    }
    function encode6bit(b) {
        if (b < 10) {
            return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
            return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
            return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b == 0) {
            return '-';
        }
        if (b == 1) {
            return '_';
        }
        return '?';
    }
};

const plantUmlServerUrl = (baseURL, imageFormat, content) =>
    `${baseURL}/${imageFormat}/0/${urlTextFrom(content)}`;

const clearConsole = () => {
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');
};

const plantumlVersions = [
    {
        version: '1.2020.07',
        jar: 'plantuml-1.2020.7.jar'
    },
    {
        version: '1.2020.17',
        jar: 'plantuml.1.2020.17.jar'
    },
    {
        version: '1.2021.7',
        jar: 'plantuml.1.2021.7.jar'
    },
    {
        version: '1.2021.12',
        jar: 'plantuml.1.2021.12.jar'
    },
    {
        version: '1.2022.3',
        jar: 'plantuml-1.2022.3.jar'
    },
    {
        version: '1.2024.3',
        jar: 'plantuml.1.2024.3.jar'
    },
    {
        version: '1.2025.2',
        isLatest: true,
        jar: 'plantuml-1.2025.2.jar'
    }
];

module.exports = {
    makeDirectory,
    readFile,
    writeFile,
    encodeURIPath,
    writeOnSameLine,
    clearConsole,
    plantUmlServerUrl,
    plantumlVersions
};
