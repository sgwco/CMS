import express from 'express';
import path from 'path';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { schema } from './schemas';

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
}

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));



server.use('/public', express.static(publicPath));
server.get('*', (req, res, next) => {
  res.sendFile(indexPath);
});



server.listen(PORT, () => console.log(`GraphQL server is now running on http://localhost:${PORT}`));