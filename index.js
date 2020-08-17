require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const BookSchema = require("./schema/schema");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const CORS = require("cors");
const app = express();
const MONGO = process.env.MONGO_LINK;
app.use(bodyParser.json());
app.use(CORS());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: BookSchema,
    graphiql: true,
  })
);
app.listen(4000, () => {
  console.log("listening");
  mongoose.connect(
    MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("connected to db");
      }
    }
  );
});
