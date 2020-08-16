const { Schema, model } = require("mongoose");

const authorSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  age: { type: Schema.Types.Number, required: true },
  books: [{ type: Schema.Types.ObjectId, ref: "book" }],
});
module.exports = new model("author", authorSchema);
