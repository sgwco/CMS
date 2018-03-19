import express from 'express';
import path from 'path';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';

import { schema } from './schemas';

const PORT = 4000;
const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
server.get('*', (req, res, next) => {
  console.log(req.url)
  if (req.url === '/graphql' || req.url === '/graphiql') return next();
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

server.listen(PORT, () => console.log(`GraphQL server is now running on http://localhost:${PORT}`));