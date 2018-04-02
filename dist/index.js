'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _schemas = require('./src/schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 8000;
var server = (0, _express2.default)();

var publicPath = null;
var indexPath = null;

if (process.env.NODE_ENV === 'production') {
  publicPath = _path2.default.resolve(__dirname, '..', 'client', 'build');
  indexPath = _path2.default.resolve(__dirname, '..', '..', 'client', 'build', 'index.html');

  server.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({ endpointURL: '/api' }));
} else {
  publicPath = _path2.default.resolve(__dirname, 'client', 'build');
  indexPath = _path2.default.resolve(__dirname, 'client', 'build', 'index.html');
}

server.use('/api', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({ schema: _schemas2.default }));
server.use('/public', _express2.default.static(publicPath));
server.get('*', function (req, res, next) {
  res.sendFile(indexPath);
});

server.listen(PORT, function () {
  return console.log('GraphQL server is now running on http://localhost:' + PORT);
});