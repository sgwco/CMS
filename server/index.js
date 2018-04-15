import 'babel-polyfill';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { initDatabase, connection } from './src/config/database';
import Schema from './src/schema';
import dataLoaders from './src/config/dataLoaders'
import { createToken, verifyToken } from './src/config/auth';

const PORT = 8000;
const server = express();

let publicPath = null;
let indexPath = null;

initDatabase(connection);

server.use(cors());
server.options('*', cors());

if (process.env.NODE_ENV === 'production') {
  publicPath = path.resolve(__dirname, '..', '..', 'client', 'build');
  indexPath = path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html');
}
else {
  publicPath = path.resolve(__dirname, '..', 'client', 'build');
  indexPath = path.resolve(__dirname, '..', 'client', 'build', 'index.html');

  server.use('/graphiql', graphiqlExpress({ endpointURL: '/api' }));
}

server.use('/api', (req, res, next) => {
  const token = req.headers.authorization;
  req.payload = verifyToken(token);
  next();
});
server.use('/api', bodyParser.json(), graphqlExpress(req => (
  { 
    schema: Schema,
    context: {
      dataloaders: dataLoaders,
      payload: req.payload
    }
  }
)));
server.use(express.static(publicPath));
server.get('*', (req, res) => {
  res.sendFile(indexPath);
});

server.listen(PORT, () => console.log(`GraphQL server is now running on http://localhost:${PORT}`));