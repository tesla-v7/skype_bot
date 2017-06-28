'use strict';
var fs          = require('fs');
var readline    = require('readline');
var google      = require('googleapis');
var googleAuth  = require('google-auth-library');
// var env         = process.env.NODE_ENV || 'development';
// var config      = require(__dirname + '/../config/config.json')[env || 'development'];

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/spreadsheets'
];

module.exports = {
    auth: null,
    setAuth: function (auth) {
        this.auth = auth;
    },
    get: function (sheetID, range) {
        return new Promise((resolve, reject)=>{
            function authorize(credentials, callback) {
                var clientSecret = credentials.installed.client_secret;
                var clientId = credentials.installed.client_id;
                var redirectUrl = credentials.installed.redirect_uris[0];
                var auth = new googleAuth();
                var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

                oauth2Client.credentials = credentials.token;
                callback(oauth2Client);
            }

            authorize(this.auth, getList);

            function getList(auth) {
                var sheets = google.sheets('v4');
                sheets.spreadsheets.values.get({
                    auth: auth,
                    spreadsheetId: sheetID,
                    range: encodeURI(range),
                    // range: encodeURI("'лист-1'!B2:AG100"),
                    dateTimeRenderOption: "FORMATTED_STRING",
                    majorDimension: "ROWS",
                    valueRenderOption: "FORMATTED_VALUE",

                }, function (err, response) {
                    if (err) {
                        console.log('ERR == ', err);
                        reject(new Error(err));
                        // return;
                    }
                    // console.log(JSON.stringify(response, null, 2));
                    resolve(response);

                    // TODO: Change code below to process the `response` object:

                });
            };
        });

    },
    save: function (sheetID, range, data){
        return new Promise((resolve, reject) => {

            authorize(this.auth, listMajors, data);

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

                oauth2Client.credentials = credentials.token;
                callback(oauth2Client);
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
                rl.question('Enter the code from that page here: ', function (code) {
                    rl.close();
                    oauth2Client.getToken(code, function (err, token) {
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
                // sheets.spreadsheets.({
                //     auth: auth,
                //     spreadsheetId: sheetID,
                //     range: encodeURI(range),
                //     startIndex: encodeURI("'лист-1'!AF2:AF6"),
                //     format: {
                //         foregroundColor: {
                //             red: 255,
                //             green: 0,
                //             blue: 0,
                //             alpha: 0,
                //         },
                //         // "fontFamily": string,
                //         // "fontSize": number,
                //         bold: true,
                //         // "italic": false,
                //         // "strikethrough": false,
                //         // "underline": false,
                //     },
                // });
                // sheets.spreadsheets.values.batchUpdate()
                // sheets.spreadsheets.values.batchUpdate(
                //     {
                //         auth: auth,
                //         valueInputOption: 'RAW',
                //         spreadsheetId: sheetID
                //     },
                //     {
                //         RepeatCellRequest: {
                //             repeatCell: {
                //                 range: {
                //                     sheetId: 0,
                //                     startRowIndex: 2,
                //                     endRowIndex: 3,
                //                     startColumnIndex: 0,
                //                     endColumnIndex: 25
                //                 },
                //                 cell: {
                //                     userEnteredFormat: {
                //                         horizontalAlignment: 'CENTER',
                //                         textFormat: {
                //                             // bold: true,
                //                             // italic: true,
                //                             foregroundColor: {
                //                                 red: 1,
                //                                 green: 0,
                //                                 blue: 0
                //                             }
                //                         }
                //                     }
                //                 },
                //                 // fields: 'userEnteredFormat'
                //             }
                //         }
                //     }, function (err, response) {
                //         if (err) {
                //             console.log('ERR == ', err);
                //             return;
                //         }
                //
                //         // TODO: Change code below to process the `response` object:
                //         console.log(JSON.stringify(response, null, 2));
                //
                //     });
                sheets.spreadsheets.values.update({
                    auth: auth,
                    spreadsheetId: sheetID,
                    range: encodeURI(range),
                    // range: encodeURI("'лист-1'!AF2:AF6"),
                    includeValuesInResponse: true,
                    responseDateTimeRenderOption: 'SERIAL_NUMBER',
                    responseValueRenderOption: 'UNFORMATTED_VALUE',
                    // range: encodeURI("test1!AF2:AF6"),
                    valueInputOption: 'RAW',
                    resource: {
                        "range": range,
                        // "range": "'лист-1'!AF2:AF6",
                        // "range": encodeURI("test1!AF2:AF6"),
                        "values": data
                    },
                }, function (err, response) {
                    if (err) {
                        // console.log('ERR == ', err);
                        reject(err);
                        return;
                    }
                    resolve(response);

                    // // TODO: Change code below to process the `response` object:
                    // console.log(JSON.stringify(response, null, 2));

                });
            }
        });
    }
};