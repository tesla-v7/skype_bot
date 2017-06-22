'use strict';
var fs          = require('fs');
var readline    = require('readline');
var google      = require('googleapis');
var googleAuth  = require('google-auth-library');
var env         = process.env.NODE_ENV || 'development';
var config      = require(__dirname + '/../config/config.json')[env || 'development'];

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/spreadsheets'
];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//     process.env.USERPROFILE) + '/.credentials/';
// // var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';
// var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';
// console.log('TOKEN_PATH ', TOKEN_PATH);
// Load client secrets from a local file.
// fs.readFile('client_secret.json', function processClientSecrets(err, content) {
//     if (err) {
//         console.log('Error loading client secret file: ' + err);
//         return;
//     }
//     // Authorize a client with the loaded credentials, then call the
//     // Google Sheets API.
//     console.log('------------------------------------------------');
//     console.log(JSON.parse(content));
//     console.log('---');
//     console.log(config.auth.google);
//     console.log('------------------------------------------------');
//     authorize(JSON.parse(content), listMajors);
// });

authorize(config.auth.google.client_secret, listMajors);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.

    oauth2Client.credentials = config.auth.google.token;
    callback(oauth2Client);

    // fs.readFile(TOKEN_PATH, function(err, token) {
    //     if (err) {
    //         getNewToken(oauth2Client, callback);
    //     } else {
    //         console.log('------------------------------------------------');
    //         console.log(JSON.parse(token));
    //         console.log('---');
    //         console.log(config.auth.google);
    //         console.log('------------------------------------------------');
    //         // oauth2Client.credentials = JSON.parse(token);
    //         // callback(oauth2Client);
    //     }
    // });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth) {
    var sheets = google.sheets('v4');
    // sheets.spreadsheets.values.get({
    //     auth: auth,
    //     spreadsheetId: '1VHM_L-01iymfGT-CpSquqJcxZiuWCzWSBI518Ty6iKQ',
    //     // spreadsheetId: '13XfXn2lQClHf68FgXCOrIr_tnezTaJ64Vx_5mtru0yU',
    //     // spreadsheetId: '1HFPoxqOcTbGpSDC9w0ASgFlp8x_Ba2bM-u8tTmUXU9s',
    //     // spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    //     range: encodeURI("'Лист1'!B1:B27"),
    // }, function(err, response) {
    //     if (err) {
    //         console.log('The API returned an error: ' + err);
    //         return;
    //     }
    //     console.log('//---------------------------------------------');
    //     console.log(response);
    //     console.log('//---------------------------------------------');
    //     // var rows = response.values;
    //     // if (rows.length == 0) {
    //     //     console.log('No data found.');
    //     // } else {
    //     //     console.log('Name, Major:');
    //     //     for (var i = 0; i < rows.length; i++) {
    //     //         var row = rows[i];
    //     //         // console.log(row.length);
    //     //         // Print columns A and E, which correspond to indices 0 and 4.
    //     //         console.log('%s, %s', row[0], row[31]);
    //     //     }
    //     // }
    // });
    sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: '1VHM_L-01iymfGT-CpSquqJcxZiuWCzWSBI518Ty6iKQ',
        range: encodeURI("'лист-1'!AF2:AF6"),
        includeValuesInResponse: true,
        responseDateTimeRenderOption: 'SERIAL_NUMBER',
        responseValueRenderOption: 'UNFORMATTED_VALUE',
        // range: encodeURI("test1!AF2:AF6"),
        valueInputOption: 'RAW',
        resource: {
            "range": "'лист-1'!AF2:AF6",
            // "range": encodeURI("test1!AF2:AF6"),
            "values": [
                [12],
                [13],
                [],
                [15],
                [16]
            ]
        }
    },function(err, response) {
        if (err) {
            console.log('ERR == ', err);
            return;
        }

        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));

    });
}