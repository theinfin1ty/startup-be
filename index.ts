import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import mongoose  from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { json } from 'body-parser';
import http from 'http';

config();
const app = express();

const httpServer = http.createServer(app);
app.use(cors());
app.use(json());

const typeDefs = `#graphql

  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const serverIntialise =async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    
    await server.start();
    
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
      })
    );
  } catch (error) {
    console.log(error);
  }
}

serverIntialise();

mongoose.connect(process.env.DB_URI as string, () => {
  console.log("Connected to MongoDB");
});

app.all('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`)
});