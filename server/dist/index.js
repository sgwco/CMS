'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _database = require('./src/config/database');

var _schema = require('./src/schema');

var _schema2 = _interopRequireDefault(_schema);

var _dataLoaders = require('./src/config/dataLoaders');

var _dataLoaders2 = _interopRequireDefault(_dataLoaders);

var _auth = require('./src/config/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 8000;
var server = (0, _express2.default)();

var publicPath = null;
var indexPath = null;

(0, _database.initDatabase)(_database.connection);

server.use((0, _cors2.default)());
server.options('*', (0, _cors2.default)());

if (process.env.NODE_ENV === 'production') {
  publicPath = _path2.default.resolve(__dirname, '..', '..', 'client', 'build');
  indexPath = _path2.default.resolve(__dirname, '..', '..', 'client', 'build', 'index.html');
} else {
  publicPath = _path2.default.resolve(__dirname, '..', 'client', 'build');
  indexPath = _path2.default.resolve(__dirname, '..', 'client', 'build', 'index.html');

  server.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({ endpointURL: '/api' }));
}

server.use('/api', function (req, res, next) {
  var token = req.headers.authorization;
  req.payload = (0, _auth.verifyToken)(token);
  next();
});
server.use('/api', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)(function (req) {
  return {
    schema: _schema2.default,
    context: {
      dataloaders: _dataLoaders2.default,
      payload: req.payload
    }
  };
}));
server.use(_express2.default.static(publicPath));
server.get('*', function (req, res) {
  res.sendFile(indexPath);
});

server.listen(PORT, function () {
  return console.log('GraphQL server is now running on http://localhost:' + PORT);
});