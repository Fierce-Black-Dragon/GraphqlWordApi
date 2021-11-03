import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";

import bodyParser from "body-parser";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
app.use(cors());
app.listen(
  PORT,
  console.log(` server started and runing on http://localhost:${PORT}`)
);
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    hello: {
      type: GraphQLString,
      description: "Hello World",
      resolve: () => "Hello World",
    },
  }),
});
const schema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: RootMutationType
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
