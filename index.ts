import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';
import http from 'http';
import abuse from './graphql/abuse';

config();

const app = express();

const httpServer = http.createServer(app);

app.use(cors());
app.use(json());

const registerApolloEndpoint = async (app, httpServer, params, path) => {
  const endpoint = new ApolloServer({
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    ...params,
  });

  await endpoint.start();
  app.use(
    path,
    expressMiddleware(endpoint, {
      context: async ({ req, res }) => ({
        user: {}, // TODO: implement function to verify bearer token
        req,
        res,
      }),
    })
  );
};

registerApolloEndpoint(
  app,
  httpServer,
  {
    typeDefs: abuse.typeDefs,
    resolvers: abuse.resolvers,
  },
  '/abuse'
);

app.all('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
