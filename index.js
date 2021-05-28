// Edited example Parse server for Linum Framework
// This is meant for using when deploying with Heroku

// Initialize
const express = require('express');
const app = express();

// Server configuration
const ParseServer = require('parse-server').ParseServer;
const api = new ParseServer({
  // "unchangeable" values, probably should be environmental, but maybe later
  cloud: __dirname + '/cloud/main.js', // Cloud code directory
  liveQuery: {
    classNames: ['Posts', 'Comments'] // LiveQuery placeholder setup
  },
  // CONSTANTS
  // app basic info
  appId: process.env.APP_ID,
  appName: process.env.APP_NAME,
  serverURL: process.env.SERVER_URL,
  // database url, the thing that it all works on
  databaseURI: process.env.DATABASE_URI,
  // keys for API access
  masterKey: process.env.MASTER_KEY,
  readOnlyMasterKey: process.env.READ_ONLY_MASTER_KEY,
  clientKey: process.env.CLIENT_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  fileKey: process.env.FILE_KEY,
  restAPIKey: process.env.REST_API_KEY,
  javascriptKey: process.env.JAVASCRIPT_KEY,
  // PROPERTIES
  allowCustomObjectId: process.env.ALLOW_CUSTOM_OBJECT_ID || "true",
  preserveFileName: process.env.PRESERVE_FILE_NAME || "true",
  
  sessionLength: process.env.SESSION_LENGTH || "300",
  
  logLevel: process.env.LOG_LEVEL || "INFO"
});

// Allow cross-origin requests
const cors = require('cors');
app.use(cors());

// Set the main path for Parse API
const mountPath = process.env.PARSE_MOUNT || "/parse";
app.use(mountPath, api);

// other server path shenanigans
const path = require('path');
// display something when you're trying to access anything other than API
app.get('/', function (req, res) {
  res.status(200).send('Nothing to see here?');
});
// static assets like pictures should go in /public
app.use('/public', express.static(path.join(__dirname, '/public')));

// reference for later
/* app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
}); */

// Weird thing where you need to listen for the port which Heroku gave you, otherwise server would crash
const port = process.env.PORT;
var httpServer = require('http').createServer(app);
httpServer.listen(port)
ParseServer.createLiveQueryServer(httpServer);