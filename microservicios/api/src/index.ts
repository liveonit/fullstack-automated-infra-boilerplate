import "reflect-metadata";

import { connectDb } from './dbconfig'

import { buildSchema } from "type-graphql";

import { BookResolver } from './resolvers/Book'
import { AuthorResolver } from './resolvers/Author';
import { EditionResolver } from './resolvers/Editions';
import { LogResolver } from './resolvers/Logs'
import { Env, isEnv } from './utils/environment'

import express, { Application } from 'express'
import cors from 'cors'
import compression from 'compression';
import { createServer } from 'http';

import { ApolloServer } from 'apollo-server-express'

import { PubSub, PubSubEngine } from 'graphql-subscriptions';

export const pubsub: PubSubEngine = new PubSub();


async function main() {

  // Configuracion de variables de entorno
  const nodeEnv: Env = isEnv(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development'
  const port = process.env.API_PORT || '9000';


  // Conexion con la base de datos
  const connection = await connectDb();
  

  // Compilado de graphql `schema` a partir de los resolver y clases con decoradores
  const schema = await buildSchema({
    resolvers: [BookResolver, AuthorResolver, EditionResolver, LogResolver],
    pubSub: pubsub
  })


  // Crea la app de express
  const app: Application = express();
  // Crea el servidor http
  const server = createServer(app);

  // Crea el servidor de apollo
  const apolloServer = new ApolloServer({ schema, subscriptions: {
    path: "/graphql",
  },})
  
  // Apollo server cuenta con la siguiente funcion que agrega a la app 
  // de express el servidor apollo en el path que le pasemos, este caso `/graphql`
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  /* Attach subscription server to GraphQL server */
  apolloServer.installSubscriptionHandlers(server)

  // cors and response compress middlewares
  app.use('*', cors());
  app.use(compression());
  
  // enpoint para verificar que el servidor http y express esta funcionando correctametne
  app.get('/healthz', (req, res) => { res.send('Everything is fine!!!') })

  server.listen(
    { host: '0.0.0.0', port: parseInt(port) },
    (): void => {
      console.log(`Enviornment: ===>>> ${nodeEnv} <<<===`);
      console.log(`\n🚀      Express server is now running on http://localhost:${port}`);
      console.log(`\n🚀      GraphQL is now running on http://localhost:${port}/graphql`);
      console.log(`\n🚀      GraphQL is now running on ws://localhost:${port}/graphql`);
    });
}
if (require.main === module) {
  main()
}