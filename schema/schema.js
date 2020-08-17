const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const mongoose = require("mongoose");
const _ = require("lodash");
const Author = require("../model/authors");
const Book = require("../model/books");
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent, args) {
        return await Author.findOne({ books: parent.id });
        // return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        return await Book.find({ author: parent.id });
        // return _.filter(books, (b) => {
        //   // return b.authorId == parent.id;
        // });
      },
    },
  }),
});
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Book.findById(args.id);
        // return _.find(books, { id: args.id });
        //code to get data from db / other source
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await Author.findById(args.id);
        // return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        return await Book.find();
        // return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        return await Author.find();
        // return authors;
      },
    },
  },
});
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        let author = new Author({ name: args.name, age: args.age });
        return await author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        let book = new Book({
          author: args.authorId,
          name: args.name,
          genre: args.genre,
        });
        const savedbook = await book.save();
        const bookAuthor = await Author.findOneAndUpdate(
          { _id: savedbook.author },
          { $push: { books: savedbook.id } }
        );

        await bookAuthor.save();
        return savedbook;
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
