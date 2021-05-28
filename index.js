// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const app = express();

const ParseServer = require('parse-server').ParseServer;
const api = new ParseServer({
  
  cloud: __dirname + '/cloud/main.js',
  liveQuery: {
    classNames: ['Posts', 'Comments'],
  },
  
  appId: process.env.APP_ID,
  appName: process.env.APP_NAME,
  serverURL: process.env.SERVER_URL,
  
  databaseURI: process.env.DATABASE_URI,
  
  masterKey: process.env.MASTER_KEY,
  readOnlyMasterKey: process.env.READ_ONLY_MASTER_KEY,
  clientKey: process.env.CLIENT_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  fileKey: process.env.FILE_KEY,
  restAPIKey: process.env.REST_API_KEY,
  javascriptKey: process.env.JAVASCRIPT_KEY,
  
  allowCustomObjectId: process.env.ALLOW_CUSTOM_OBJECT_ID,
  preserveFileName: process.env.PRESERVE_FILE_NAME,
  
  sessionLength: process.env.SESSION_LENGTH
});

const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 1337
const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

const path = require('path');

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix

const mountPath = process.env.PARSE_MOUNT
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('Nothing to see here?');
});

// reference for later
/* app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
}); */

module.exports = {
  app,
  api,
};