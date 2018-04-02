'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _graphqlTools = require('graphql-tools');

var typeDefs = '\n  type Channel {\n    id: ID!\n    name: String\n  }\n\n  type Query {\n    channels: [Channel]\n  }\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs });
exports.schema = schema;