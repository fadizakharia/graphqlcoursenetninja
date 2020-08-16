require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const BookSchema = require("./schema/schema");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const app = express();
const MONGO = process.env.MONGO_LINK;
app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: BookSchema,
    graphiql: true,
  })
);
app.listen(3000, () => {
  console.log("listening");
  mongoose.connect(
    MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("connected to db");
      }
    }
  );
});
