import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";

import bodyParser from "body-parser";
// import { graphql, buildSchema } from "graphql";

import rootSchema from "./graphQl/schema/schema.js";
import mongoose from "mongoose";
import rootReslover from "./graphQl/reslover/reslover.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
// to resolve cross origin error
app.use(cors());
const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqyqk.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

// databse connection
const db = mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(
      PORT,
      console.log(
        ` server started and runing on http://localhost:${PORT}  database connceted :)`
      )
    );
  })
  .catch((err) => {
    console.log(err);
  });
// graphql api
app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: rootReslover,
    graphiql: true,
  })
);
app.get("/", (req, res) => {
  res.send("hello  server is running :)");
});
