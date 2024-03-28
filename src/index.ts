import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  const gqlserver = new ApolloServer({
    typeDefs: `
    type Query {
      hello: String
      movies: [Movie!]!
      movie(id: String!): Movie
    }
    type Mutation {
      createMovie(title: String!): Boolean
      deleteMovie(id: String!): Boolean
    }
    type Movie {
      id: String!
      title: String!
    }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there`,
        movie: async (_, { id }) => {
          try {
            const movie = await prismaClient.movie.findUnique({
              where: { id }
            });
            return movie;
          } catch (error) {
            console.error('Error fetching movie:', error);
            throw error;
          }
        },
        movies: async () => {
          try {
            const movies = await prismaClient.movie.findMany();
            return movies;
          } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
          }
        }
      },
      Mutation: {
        createMovie: async(_, { title }: {title: string}) => {
          await prismaClient.movie.create({
            data: {
              title
            },
          })
          return true;
        },
        deleteMovie: async (_, { id }) => {
          try {
            await prismaClient.movie.delete({
              where: { id }
            });
            return true;
          } catch (error) {
            console.error('Error deleting movie:', error);
            throw error;
          }
        }
      }
    },
  });
  await gqlserver.start();

  app.get("/", (req, res) => {
    res.json({ message: "seevering" });
  });
  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => console.log(`server is riu ${PORT}`));
}

init();