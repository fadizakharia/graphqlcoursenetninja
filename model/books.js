const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  genre: { type: Schema.Types.String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "author" },
});
module.exports = new model("book", bookSchema);
