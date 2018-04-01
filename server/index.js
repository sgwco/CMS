import express from 'express';
import path from 'path';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import Schema from './src/schema';

const PORT = 8000;
const server = express();

let publicPath = null;
let indexPath = null;

if (process.env.NODE_ENV === 'production') {
  publicPath = path.resolve(__dirname, '..', '..', 'client', 'build');
  indexPath = path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html');
}
else {
  publicPath = path.resolve(__dirname, '..', 'client', 'build');
  indexPath = path.resolve(__dirname, '..', 'client', 'build', 'index.html');

  server.use('/graphiql', graphiqlExpress({ endpointURL: '/api' }));
}

server.use('/api', bodyParser.json(), graphqlExpress({ schema: Schema }));
server.use('/public', express.static(publicPath));
server.get('*', (req, res, next) => {
  res.sendFile(indexPath);
});

server.listen(PORT, () => console.log(`GraphQL server is now running on http://localhost:${PORT}`));